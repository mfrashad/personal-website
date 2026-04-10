import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────

interface Skill {
    id: string;
    title: string;
    icon: string;
    tags: string[];
    parentId?: string;
    duration?: number;
    xp?: string;
    amount?: number;
    image?: string;
    url?: string;
    description?: string;
    hidden?: boolean;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    tags: string[];
    date?: string;
    unlocked: boolean;
    image?: string;
    caption?: string;
    skills?: string[];
}

type Tab = 'skills' | 'achievements';

const SKILL_TAGS = ['Creative', 'Adventurous', 'Physical', 'Sport', 'Intellectual', 'Social'] as const;
const XP_LEVELS = ['explored', 'beginner', 'hobbyist', 'passionate'] as const;
const ACHIEVEMENT_CATEGORIES = [
    'academic', 'professional', 'technical', 'athletic',
    'community', 'adventure', 'fitness', 'skill',
    'sports', 'creative', 'travel', 'personal',
    'career', 'wealth', 'fame', 'business', 'art', 'habits', 'social',
] as const;

// ── URL param persistence ──────────────────────────────

function getUrlParam(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get(key);
}

function setUrlParams(params: Record<string, string | null>) {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(params)) {
        if (v === null) sp.delete(k);
        else sp.set(k, v);
    }
    const qs = sp.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
}

// ── Image Drop Zone ────────────────────────────────────

function SkillImageDropZone({
    currentSrc,
    skillId,
    onUploaded,
}: {
    currentSrc?: string;
    skillId: string;
    onUploaded: (path: string) => void;
}) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const zoneRef = useRef<HTMLDivElement>(null);

    const upload = useCallback(async (file: File) => {
        if (!skillId) { setError('Save skill first'); return; }
        if (!file.type.startsWith('image/')) { setError('Not an image file'); return; }
        const blobUrl = URL.createObjectURL(file);
        setLocalPreview(blobUrl);
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('skillId', skillId);
            const res = await fetch('/api/admin/skill-image', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            onUploaded(data.path);
        } catch (err: any) {
            setError(err.message);
            setLocalPreview(null);
            URL.revokeObjectURL(blobUrl);
        } finally {
            setUploading(false);
        }
    }, [skillId, onUploaded]);

    // Global paste handler — works anywhere, skips when typing in inputs
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) upload(file);
                    return;
                }
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [upload]);

    const displaySrc = localPreview || (currentSrc ? currentSrc + '?t=' + Date.now() : null);

    return (
        <div
            ref={zoneRef}
            tabIndex={0}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) upload(file);
            }}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: 10,
                border: dragging ? '2px dashed #4361ee' : '2px dashed #ddd',
                borderRadius: 8,
                background: dragging ? '#f0f4ff' : '#fafafa',
                transition: 'all 0.15s', outline: 'none',
                minWidth: 180,
            }}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
            />
            {displaySrc ? (
                <img src={displaySrc} alt="Skill image" style={{
                    width: 160, height: 90, objectFit: 'contain',
                    borderRadius: 4, border: '1px solid #e0e0e0', background: '#fff',
                }} />
            ) : (
                <div style={{
                    width: 160, height: 90, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#bbb', fontSize: 11,
                }}>No image</div>
            )}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        fontSize: 10, padding: '3px 10px', borderRadius: 4,
                        border: '1px solid #ddd', background: '#fff', cursor: 'pointer',
                        color: '#555',
                    }}
                >
                    Browse...
                </button>
                <span style={{ fontSize: 9, color: '#aaa' }}>
                    {uploading ? 'Uploading...' : 'or drag / paste anywhere'}
                </span>
            </div>
            {error && <span style={{ fontSize: 9, color: '#e74c3c' }}>{error}</span>}
        </div>
    );
}

// ── Autocomplete Dropdown ──────────────────────────────

function AutocompleteDropdown({
    options,
    value,
    onChange,
    placeholder,
    multi = false,
}: {
    options: { id: string; label: string; icon: string }[];
    value: string | string[];
    onChange: (val: string | string[]) => void;
    placeholder?: string;
    multi?: boolean;
}) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Calculate fixed position when opening
    useEffect(() => {
        if (open && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPos({ top: rect.bottom + 2, left: rect.left, width: rect.width });
        }
    }, [open]);

    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
    );

    const selectedIds = multi ? (value as string[]) : [];

    const dropdownStyle: React.CSSProperties = dropdownPos ? {
        position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width,
        background: '#fff', border: '1px solid #ddd', borderRadius: 6,
        maxHeight: 200, overflowY: 'auto', zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    } : {};

    if (multi) {
        const selectedOptions = options.filter((o) => selectedIds.includes(o.id));
        return (
            <div ref={ref} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                    {selectedOptions.map((o) => (
                        <span key={o.id} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            background: '#e8eaff', borderRadius: 12, padding: '2px 8px',
                            fontSize: 12,
                        }}>
                            {o.icon} {o.label}
                            <button
                                onClick={() => onChange(selectedIds.filter((id) => id !== o.id))}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 12, color: '#888', padding: 0, lineHeight: 1,
                                }}
                            >x</button>
                        </span>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder || 'Search...'}
                    style={{
                        width: '100%', padding: '6px 8px', border: '1px solid #ddd',
                        borderRadius: 6, fontSize: 13, boxSizing: 'border-box',
                    }}
                />
                {open && filtered.length > 0 && (
                    <div style={dropdownStyle}>
                        {filtered.filter((o) => !selectedIds.includes(o.id)).map((o) => (
                            <div key={o.id}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange([...selectedIds, o.id]);
                                    setQuery('');
                                    setOpen(false);
                                }}
                                style={{
                                    padding: '6px 10px', cursor: 'pointer', fontSize: 13,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f2ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                            >
                                <span>{o.icon}</span> {o.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Single select mode
    const selectedOption = options.find((o) => o.id === value);
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                value={open ? query : (selectedOption ? `${selectedOption.icon} ${selectedOption.label}` : '')}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => { setQuery(''); setOpen(true); }}
                placeholder={placeholder || 'None'}
                style={{
                    width: '100%', padding: '6px 8px', border: '1px solid #ddd',
                    borderRadius: 6, fontSize: 13, boxSizing: 'border-box',
                }}
            />
            {value && (
                <button
                    onClick={() => { onChange(''); setQuery(''); }}
                    style={{
                        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#999',
                        fontSize: 14, padding: 0,
                    }}
                >x</button>
            )}
            {open && (
                <div style={dropdownStyle}>
                    <div
                        onMouseDown={(e) => { e.preventDefault(); onChange(''); setOpen(false); }}
                        style={{
                            padding: '6px 10px', cursor: 'pointer', fontSize: 13,
                            color: '#999', fontStyle: 'italic',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f2ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                        None (root)
                    </div>
                    {filtered.map((o) => (
                        <div key={o.id}
                            onMouseDown={(e) => { e.preventDefault(); onChange(o.id); setQuery(''); setOpen(false); }}
                            style={{
                                padding: '6px 10px', cursor: 'pointer', fontSize: 13,
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: o.id === value ? '#f0f2ff' : '',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f2ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = o.id === value ? '#f0f2ff' : '')}
                        >
                            <span>{o.icon}</span> {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Delete Confirmation Dialog ─────────────────────────

function DeleteDialog({
    skillTitle,
    childCount,
    onCancel,
    onDelete,
}: {
    skillTitle: string;
    childCount: number;
    onCancel: () => void;
    onDelete: (cascade: boolean) => void;
}) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
            <div style={{
                background: '#fff', borderRadius: 12, padding: 24, maxWidth: 400, width: '90%',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Delete "{skillTitle}"?</h3>
                {childCount > 0 ? (
                    <>
                        <p style={{ fontSize: 13, color: '#555', margin: '0 0 16px' }}>
                            This skill has {childCount} child skill{childCount > 1 ? 's' : ''}.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button
                                onClick={() => onDelete(false)}
                                style={{
                                    padding: '8px 16px', border: '1px solid #ddd', borderRadius: 6,
                                    background: '#fff', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                                }}
                            >
                                Delete only this skill (children become root-level)
                            </button>
                            <button
                                onClick={() => onDelete(true)}
                                style={{
                                    padding: '8px 16px', border: '1px solid #e74c3c', borderRadius: 6,
                                    background: '#fef2f2', color: '#c0392b', cursor: 'pointer',
                                    fontSize: 13, textAlign: 'left',
                                }}
                            >
                                Delete with all children (cascade)
                            </button>
                            <button
                                onClick={onCancel}
                                style={{
                                    padding: '8px 16px', border: 'none', borderRadius: 6,
                                    background: '#f0f0f0', cursor: 'pointer', fontSize: 13,
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => onDelete(false)}
                            style={{
                                padding: '8px 16px', border: '1px solid #e74c3c', borderRadius: 6,
                                background: '#fef2f2', color: '#c0392b', cursor: 'pointer', fontSize: 13,
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '8px 16px', border: 'none', borderRadius: 6,
                                background: '#f0f0f0', cursor: 'pointer', fontSize: 13,
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Skill Edit Form ────────────────────────────────────

function SkillEditForm({
    skill,
    allSkills,
    onChange,
    onSave,
    onDelete,
    saving,
    isNew,
}: {
    skill: Skill;
    allSkills: Skill[];
    onChange: (s: Skill) => void;
    onSave: () => void;
    onDelete: () => void;
    saving: boolean;
    isNew: boolean;
}) {
    // Exclude self and descendants from parent options
    const getDescendantIds = (id: string): Set<string> => {
        const ids = new Set<string>();
        const collect = (parentId: string) => {
            for (const s of allSkills) {
                if (s.parentId === parentId) {
                    ids.add(s.id);
                    collect(s.id);
                }
            }
        };
        collect(id);
        return ids;
    };

    const excludedIds = new Set([skill.id, ...getDescendantIds(skill.id)]);
    const parentOptions = allSkills
        .filter((s) => !excludedIds.has(s.id))
        .map((s) => ({ id: s.id, label: s.title, icon: s.icon }));

    const durationHours = skill.duration && skill.duration >= 60
        ? `${(skill.duration / 60).toFixed(1)}h`
        : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>{isNew ? 'New Skill' : `Edit: ${skill.icon} ${skill.title}`}</h3>

            {/* ID (read-only for existing) */}
            <label style={labelStyle}>
                ID
                <input
                    value={skill.id}
                    onChange={(e) => onChange({ ...skill, id: e.target.value })}
                    disabled={!isNew}
                    style={{ ...inputStyle, ...(isNew ? {} : { background: '#f0f0f0', color: '#888' }) }}
                />
            </label>

            {/* Title + Icon row */}
            <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Title
                    <input value={skill.title} onChange={(e) => onChange({ ...skill, title: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ ...labelStyle, width: 60 }}>
                    Icon
                    <input value={skill.icon} onChange={(e) => onChange({ ...skill, icon: e.target.value })} style={{ ...inputStyle, textAlign: 'center', fontSize: 18 }} />
                </label>
            </div>

            {/* Tags */}
            <label style={labelStyle}>
                Tags
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {SKILL_TAGS.map((tag) => {
                        const active = skill.tags.includes(tag);
                        return (
                            <button key={tag} onClick={() => {
                                const newTags = active
                                    ? skill.tags.filter((t) => t !== tag)
                                    : [...skill.tags, tag];
                                onChange({ ...skill, tags: newTags });
                            }} style={{
                                padding: '4px 12px', borderRadius: 16, fontSize: 12,
                                border: active ? '1px solid #4361ee' : '1px solid #ddd',
                                background: active ? '#4361ee' : '#fff',
                                color: active ? '#fff' : '#555',
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}>
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </label>

            {/* Parent */}
            <label style={labelStyle}>
                Parent Skill
                <AutocompleteDropdown
                    options={parentOptions}
                    value={skill.parentId || ''}
                    onChange={(val) => onChange({ ...skill, parentId: val as string || undefined })}
                    placeholder="None (root)"
                />
            </label>

            {/* XP Level */}
            <label style={labelStyle}>
                XP Level
                <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #ddd' }}>
                    {XP_LEVELS.map((level) => (
                        <button key={level} onClick={() => onChange({ ...skill, xp: skill.xp === level ? undefined : level })}
                            style={{
                                flex: 1, padding: '6px 4px', fontSize: 11, border: 'none',
                                borderRight: level !== 'expert' ? '1px solid #ddd' : 'none',
                                background: skill.xp === level ? '#4361ee' : '#fff',
                                color: skill.xp === level ? '#fff' : '#555',
                                cursor: 'pointer', transition: 'all 0.15s',
                                textTransform: 'capitalize',
                            }}>
                            {level}
                        </button>
                    ))}
                </div>
            </label>

            {/* Duration + Amount row */}
            <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Duration (min)
                    <div style={{ position: 'relative' }}>
                        <input
                            type="number"
                            value={skill.duration ?? ''}
                            onChange={(e) => onChange({ ...skill, duration: e.target.value ? Number(e.target.value) : undefined })}
                            style={inputStyle}
                            placeholder="0"
                        />
                        {durationHours && (
                            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#888' }}>
                                = {durationHours}
                            </span>
                        )}
                    </div>
                </label>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Amount (times)
                    <input
                        type="number"
                        value={skill.amount ?? ''}
                        onChange={(e) => onChange({ ...skill, amount: e.target.value ? Number(e.target.value) : undefined })}
                        style={inputStyle}
                        placeholder="0"
                    />
                </label>
            </div>

            {/* URL */}
            <label style={labelStyle}>
                URL
                <input value={skill.url || ''} onChange={(e) => onChange({ ...skill, url: e.target.value || undefined })} style={inputStyle} placeholder="/diving" />
            </label>

            {/* Hidden */}
            <label style={{ ...labelStyle, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input
                    type="checkbox"
                    checked={skill.hidden || false}
                    onChange={(e) => onChange({ ...skill, hidden: e.target.checked || undefined })}
                />
                Hidden from skills wall
            </label>

            {/* Description */}
            <label style={labelStyle}>
                Description
                <textarea
                    value={skill.description || ''}
                    onChange={(e) => onChange({ ...skill, description: e.target.value || undefined })}
                    style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }}
                    placeholder="Optional description..."
                />
            </label>

            {/* Image */}
            {!isNew && (
                <label style={labelStyle}>
                    Image
                    <SkillImageDropZone
                        key={skill.id}
                        currentSrc={skill.image}
                        skillId={skill.id}
                        onUploaded={(path) => onChange({ ...skill, image: path })}
                    />
                </label>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={onSave} disabled={saving || !skill.id || !skill.title}
                    style={{
                        padding: '8px 20px', borderRadius: 6, border: 'none',
                        background: '#4361ee', color: '#fff', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, opacity: saving ? 0.6 : 1,
                    }}>
                    {saving ? 'Saving...' : isNew ? 'Create' : 'Save'}
                </button>
                {!isNew && (
                    <button onClick={onDelete} style={{
                        padding: '8px 20px', borderRadius: 6, border: '1px solid #e74c3c',
                        background: '#fff', color: '#c0392b', cursor: 'pointer', fontSize: 13,
                    }}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Achievement Edit Form ──────────────────────────────

function AchievementEditForm({
    achievement,
    allSkills,
    onChange,
    onSave,
    saving,
}: {
    achievement: Achievement;
    allSkills: Skill[];
    onChange: (a: Achievement) => void;
    onSave: () => void;
    saving: boolean;
}) {
    const skillOptions = allSkills.map((s) => ({ id: s.id, label: s.title, icon: s.icon }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Edit: {achievement.icon} {achievement.title}</h3>

            {/* Title + Icon */}
            <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Title
                    <input value={achievement.title} onChange={(e) => onChange({ ...achievement, title: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ ...labelStyle, width: 60 }}>
                    Icon
                    <input value={achievement.icon} onChange={(e) => onChange({ ...achievement, icon: e.target.value })} style={{ ...inputStyle, textAlign: 'center', fontSize: 18 }} />
                </label>
            </div>

            {/* Description */}
            <label style={labelStyle}>
                Description
                <textarea
                    value={achievement.description}
                    onChange={(e) => onChange({ ...achievement, description: e.target.value })}
                    style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }}
                />
            </label>

            {/* Category + Date */}
            <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Category
                    <select
                        value={achievement.category}
                        onChange={(e) => onChange({ ...achievement, category: e.target.value })}
                        style={inputStyle}
                    >
                        {ACHIEVEMENT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </label>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Date
                    <input value={achievement.date || ''} onChange={(e) => onChange({ ...achievement, date: e.target.value || undefined })} style={inputStyle} placeholder="2024 or 2024-06" />
                </label>
            </div>

            {/* Unlocked toggle */}
            <label style={{ ...labelStyle, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input
                    type="checkbox"
                    checked={achievement.unlocked}
                    onChange={(e) => onChange({ ...achievement, unlocked: e.target.checked })}
                />
                Unlocked
            </label>

            {/* Tags */}
            <label style={labelStyle}>
                Tags (comma-separated)
                <input
                    value={achievement.tags.join(', ')}
                    onChange={(e) => onChange({ ...achievement, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                    style={inputStyle}
                />
            </label>

            {/* Image + Caption */}
            <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Image URL
                    <input value={achievement.image || ''} onChange={(e) => onChange({ ...achievement, image: e.target.value || undefined })} style={inputStyle} placeholder="/path/to/image.jpg" />
                </label>
                <label style={{ ...labelStyle, flex: 1 }}>
                    Caption
                    <input value={achievement.caption || ''} onChange={(e) => onChange({ ...achievement, caption: e.target.value || undefined })} style={inputStyle} />
                </label>
            </div>

            {/* Skills (multi-select autocomplete) */}
            <label style={labelStyle}>
                Linked Skills
                <AutocompleteDropdown
                    options={skillOptions}
                    value={achievement.skills || []}
                    onChange={(val) => onChange({ ...achievement, skills: (val as string[]).length > 0 ? val as string[] : undefined })}
                    placeholder="Search skills to link..."
                    multi
                />
            </label>

            {/* Save */}
            <button onClick={onSave} disabled={saving}
                style={{
                    padding: '8px 20px', borderRadius: 6, border: 'none',
                    background: '#4361ee', color: '#fff', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, opacity: saving ? 0.6 : 1, alignSelf: 'flex-start',
                }}>
                {saving ? 'Saving...' : 'Save'}
            </button>
        </div>
    );
}

// ── Skill Tree Sidebar ─────────────────────────────────

function SkillTree({
    skills,
    selectedId,
    onSelect,
    search,
}: {
    skills: Skill[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    search?: string;
}) {
    // When searching, compute which skill IDs to show (matches + their ancestors)
    const visibleIds = useMemo(() => {
        if (!search) return null; // null = show all
        const q = search.toLowerCase();
        const matchIds = new Set<string>();
        for (const s of skills) {
            if (
                s.title.toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q) ||
                s.tags.some((t) => t.toLowerCase().includes(q)) ||
                (s.description || '').toLowerCase().includes(q)
            ) {
                matchIds.add(s.id);
                // Also include all ancestors so the tree context is preserved
                let current = s;
                while (current.parentId) {
                    matchIds.add(current.parentId);
                    const parent = skills.find((p) => p.id === current.parentId);
                    if (!parent) break;
                    current = parent;
                }
            }
        }
        return matchIds;
    }, [skills, search]);

    const rootSkills = skills.filter((s) => !s.parentId && (!visibleIds || visibleIds.has(s.id)));
    const childrenOf = (parentId: string) =>
        skills.filter((s) => s.parentId === parentId && (!visibleIds || visibleIds.has(s.id)));

    const renderNode = (skill: Skill, depth: number): React.ReactNode => {
        const children = childrenOf(skill.id);
        const allChildren = skills.filter((s) => s.parentId === skill.id);
        const isSelected = selectedId === skill.id;
        return (
            <div key={skill.id}>
                <div
                    onClick={() => onSelect(skill.id)}
                    style={{
                        padding: '6px 10px',
                        paddingLeft: 10 + depth * 18,
                        cursor: 'pointer',
                        background: isSelected ? '#e8eaff' : 'transparent',
                        borderLeft: isSelected ? '3px solid #4361ee' : '3px solid transparent',
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f5f5f5'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = ''; }}
                >
                    <span>{skill.icon}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.title}</span>
                    {allChildren.length > 0 && (
                        <span style={{ fontSize: 10, color: '#aaa', background: '#f0f0f0', borderRadius: 8, padding: '1px 6px' }}>
                            {allChildren.length}
                        </span>
                    )}
                    {skill.hidden && (
                        <span style={{ fontSize: 9, color: '#bbb' }}>hidden</span>
                    )}
                    {skill.xp && (
                        <span style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>{skill.xp.slice(0, 3)}</span>
                    )}
                </div>
                {children.map((c) => renderNode(c, depth + 1))}
            </div>
        );
    };

    if (skills.length === 0) {
        return <div style={{ padding: 20, color: '#aaa', fontSize: 13, textAlign: 'center' }}>No skills yet</div>;
    }

    if (rootSkills.length === 0 && search) {
        return <div style={{ padding: 20, color: '#aaa', fontSize: 13, textAlign: 'center' }}>No matches</div>;
    }

    return <div>{rootSkills.map((s) => renderNode(s, 0))}</div>;
}

// ── Shared styles ──────────────────────────────────────

const labelStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12,
    fontWeight: 600, color: '#555',
};

const inputStyle: React.CSSProperties = {
    padding: '6px 8px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 13, fontWeight: 400, color: '#1a1a2e',
    width: '100%', boxSizing: 'border-box',
};

// ── Main Component ─────────────────────────────────────

export default function SkillsAdmin() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>(() => (getUrlParam('tab') as Tab) || 'skills');
    const [selectedId, setSelectedId] = useState<string | null>(() => getUrlParam('sel'));
    const [editSkill, setEditSkill] = useState<Skill | null>(null);
    const [editAchievement, setEditAchievement] = useState<Achievement | null>(null);
    const [isNewSkill, setIsNewSkill] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('');

    const showToast = useCallback((msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Persist URL params
    useEffect(() => {
        setUrlParams({ tab: activeTab, sel: selectedId });
    }, [activeTab, selectedId]);

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/skills');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSkills(data.skills);
            setAchievements(data.achievements);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Select skill/achievement when clicking sidebar
    useEffect(() => {
        if (!selectedId) {
            setEditSkill(null);
            setEditAchievement(null);
            return;
        }
        if (activeTab === 'skills') {
            const skill = skills.find((s) => s.id === selectedId);
            if (skill) {
                setEditSkill({ ...skill });
                setIsNewSkill(false);
            }
            setEditAchievement(null);
        } else {
            const ach = achievements.find((a) => a.id === selectedId);
            if (ach) setEditAchievement({ ...ach });
            setEditSkill(null);
        }
    }, [selectedId, activeTab, skills, achievements]);

    // Save skill
    const saveSkill = async () => {
        if (!editSkill) return;
        setSaving(true);
        try {
            if (isNewSkill) {
                const res = await fetch('/api/admin/skills', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ skill: editSkill }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                showToast(`Created skill "${editSkill.title}"`, 'success');
            } else {
                const res = await fetch('/api/admin/skills', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'skill', id: editSkill.id, data: editSkill }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                showToast(`Saved skill "${editSkill.title}"`, 'success');
            }
            setIsNewSkill(false);
            setSelectedId(editSkill.id);
            await fetchData();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // Save achievement
    const saveAchievement = async () => {
        if (!editAchievement) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/skills', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'achievement', id: editAchievement.id, data: editAchievement }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            showToast(`Saved "${editAchievement.title}"`, 'success');
            await fetchData();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // Delete skill
    const deleteSkill = async (cascade: boolean) => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/skills', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteTarget.id, cascade }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            showToast(`Deleted "${deleteTarget.title}"${cascade ? ' and children' : ''}`, 'success');
            setDeleteTarget(null);
            setSelectedId(null);
            setEditSkill(null);
            await fetchData();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // New skill
    const startNewSkill = () => {
        setActiveTab('skills');
        setSelectedId(null);
        setIsNewSkill(true);
        setEditSkill({
            id: '',
            title: '',
            icon: '',
            tags: [],
        });
    };

    // Filtered achievements
    const filteredAchievements = achievements.filter((a) => {
        if (categoryFilter && a.category !== categoryFilter) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            a.title.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        );
    });

    // Count children for delete dialog
    const countChildren = (id: string): number => {
        let count = 0;
        const collect = (parentId: string) => {
            for (const s of skills) {
                if (s.parentId === parentId) {
                    count++;
                    collect(s.id);
                }
            }
        };
        collect(id);
        return count;
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading...</div>;
    }
    if (error) {
        return <div style={{ padding: 40, textAlign: 'center', color: '#e74c3c' }}>Error: {error}</div>;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 16, right: 16, zIndex: 200,
                    padding: '10px 20px', borderRadius: 8,
                    background: toast.type === 'success' ? '#27ae60' : '#e74c3c',
                    color: '#fff', fontSize: 13, fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    animation: 'fadeIn 0.2s',
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Delete dialog */}
            {deleteTarget && (
                <DeleteDialog
                    skillTitle={deleteTarget.title}
                    childCount={countChildren(deleteTarget.id)}
                    onCancel={() => setDeleteTarget(null)}
                    onDelete={(cascade) => deleteSkill(cascade)}
                />
            )}

            {/* Header */}
            <div style={{
                padding: '12px 20px', borderBottom: '1px solid #e0e0e0',
                display: 'flex', alignItems: 'center', gap: 16, background: '#fff',
            }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Skills & Achievements</h2>
                <div style={{ display: 'flex', gap: 2, background: '#f0f0f0', borderRadius: 8, padding: 2 }}>
                    {(['skills', 'achievements'] as const).map((tab) => (
                        <button key={tab} onClick={() => { setActiveTab(tab); setSelectedId(null); setSearch(''); setCategoryFilter(''); }}
                            style={{
                                padding: '6px 16px', borderRadius: 6, border: 'none', fontSize: 13,
                                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                background: activeTab === tab ? '#fff' : 'transparent',
                                color: activeTab === tab ? '#4361ee' : '#888',
                                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                textTransform: 'capitalize',
                            }}>
                            {tab} ({tab === 'skills' ? skills.length : achievements.length})
                        </button>
                    ))}
                </div>
                {activeTab === 'skills' && (
                    <button onClick={startNewSkill} style={{
                        marginLeft: 'auto', padding: '6px 14px', borderRadius: 6,
                        border: '1px solid #4361ee', background: '#fff', color: '#4361ee',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    }}>
                        + Add Skill
                    </button>
                )}
            </div>

            {/* Body */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{
                    width: 260, borderRight: '1px solid #e0e0e0', background: '#fff',
                    overflowY: 'auto', flexShrink: 0,
                }}>
                    {/* Search */}
                    {activeTab === 'skills' && (
                        <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0f0' }}>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search skills..."
                                style={{ ...inputStyle, fontSize: 12 }}
                            />
                        </div>
                    )}
                    {activeTab === 'achievements' && (
                        <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0f0' }}>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search achievements..."
                                style={{ ...inputStyle, fontSize: 12 }}
                            />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ ...inputStyle, fontSize: 11, marginTop: 4 }}
                            >
                                <option value="">All categories</option>
                                {ACHIEVEMENT_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {activeTab === 'skills' ? (
                        <SkillTree skills={skills} selectedId={selectedId} onSelect={(id) => setSelectedId(id)} search={search} />
                    ) : (
                        <div>
                            {filteredAchievements.map((a) => {
                                const isSelected = selectedId === a.id;
                                const linkedCount = a.skills?.length || 0;
                                return (
                                    <div key={a.id}
                                        onClick={() => setSelectedId(a.id)}
                                        style={{
                                            padding: '6px 10px', cursor: 'pointer',
                                            background: isSelected ? '#e8eaff' : 'transparent',
                                            borderLeft: isSelected ? '3px solid #4361ee' : '3px solid transparent',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 13, transition: 'background 0.1s',
                                        }}
                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f5f5f5'; }}
                                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = ''; }}
                                    >
                                        <span>{a.icon}</span>
                                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {a.title}
                                        </span>
                                        {!a.unlocked && <span style={{ fontSize: 9, color: '#bbb' }}>locked</span>}
                                        {linkedCount > 0 && (
                                            <span style={{
                                                fontSize: 9, background: '#4361ee', color: '#fff',
                                                borderRadius: 8, padding: '1px 5px',
                                            }}>
                                                {linkedCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                            {filteredAchievements.length === 0 && (
                                <div style={{ padding: 20, color: '#aaa', fontSize: 13, textAlign: 'center' }}>
                                    No matches
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Edit panel */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#fafafa' }}>
                    {activeTab === 'skills' && editSkill ? (
                        <SkillEditForm
                            skill={editSkill}
                            allSkills={skills}
                            onChange={setEditSkill}
                            onSave={saveSkill}
                            onDelete={() => setDeleteTarget(editSkill)}
                            saving={saving}
                            isNew={isNewSkill}
                        />
                    ) : activeTab === 'achievements' && editAchievement ? (
                        <AchievementEditForm
                            achievement={editAchievement}
                            allSkills={skills}
                            onChange={setEditAchievement}
                            onSave={saveAchievement}
                            saving={saving}
                        />
                    ) : (
                        <div style={{
                            height: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#bbb', fontSize: 14,
                        }}>
                            {activeTab === 'skills'
                                ? 'Select a skill or click "+ Add Skill"'
                                : 'Select an achievement to edit'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
