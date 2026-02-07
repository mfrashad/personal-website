export interface GrantItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const malaysiaGovGrants: GrantItem[] = [
    {
        name: 'Cradle Fund (up to RM750k)',
        description: 'Malaysia\'s early-stage startup funder under MOF. CIP Spark: up to RM150k conditional grant for pre-commercialization (individuals & companies). CIP Sprint: up to RM600k for commercialization (companies only). Both up to 18 months.',
        url: 'https://cradle.com.my/',
        tags: ['Pre-seed to Seed', '18 months'],
    },
    {
        name: 'MDEC Grants',
        description: 'Malaysia Digital Economy Corporation grants including Digital Content Grant, Digital Catalyst Grant, Digital Export Grant, and Digital Acceleration Grant for digital businesses.',
        url: 'https://mdec.my/grants',
        tags: ['Seed to Growth', 'Digital'],
    },
    {
        name: 'MYStartup Accelerator (up to RM1M)',
        description: 'National accelerator program under MOSTI offering up to RM1,000,000 in grants and funding for hypergrowth startups.',
        url: 'https://www.mystartup.gov.my/',
        tags: ['Growth', 'Accelerator'],
    },
    {
        name: 'MTDC (up to RM500k)',
        description: 'Malaysian Technology Development Corporation. CRDF grant up to RM500k (70% of eligible expenses) for commercialization. Also offers National Technology & Innovation Sandbox and Dana MyST for seed to Series A.',
        url: 'https://www.mtdc.com.my/',
        tags: ['Seed to Series A', 'Tech'],
    },
    {
        name: 'Khazanah Future Malaysia',
        description: 'Khazanah Nasional sovereign wealth fund program supporting startups from pre-seed to Series C.',
        url: 'https://www.khazanah.com.my/',
        tags: ['Pre-seed to Series C'],
    },
    {
        name: 'Malaysia Co-Investment Fund (MyCIF)',
        description: 'Securities Commission Malaysia fund that co-invests alongside private investors in Malaysian startups at all stages.',
        url: 'https://www.sc.com.my/',
        tags: ['All stages', 'Co-investment'],
    },
    {
        name: 'Malaysia Debt Ventures (MDV)',
        description: 'Government financing for ICT sector. Offers liquidity financing, TACT 2.0 commercialization scheme, and TechVF Microfund for Series A+ tech startups.',
        url: 'https://www.mdv.com.my/',
        tags: ['Series A+', 'Debt financing'],
    },
    {
        name: 'VentureTECH',
        description: 'Government investment company established in 2009 supporting Series A to Growth stage companies in high-value and high-tech industries via equity investment.',
        url: 'https://www.venturetech.my/',
        tags: ['Series A to Growth', 'Equity'],
    },
    {
        name: 'Sidec Selangor Accelerator',
        description: 'Selangor state accelerator program under Invest Selangor for startups in the Klang Valley region.',
        url: 'https://sidec.com.my/',
        tags: ['Selangor', 'Accelerator'],
    },
    {
        name: 'NanoMalaysia',
        description: 'Nanotechnology commercialization under MOSTI. Programs include NESTI (Energy Storage), REVOLUTIoNT (4IR), and Hydrogen EcoNanoMY for pre-seed nanotech startups.',
        url: 'https://nanomalaysia.com.my/',
        tags: ['Pre-seed', 'Nanotech'],
    },
    {
        name: 'Ekuinas',
        description: 'Ekuiti Nasional Berhad private equity fund for Bumiputera wealth creation, focusing on creating next-generation leading companies.',
        url: 'https://www.ekuinas.com.my/',
        tags: ['Growth', 'Bumiputera'],
    },
    {
        name: 'TERAJU',
        description: 'Bumiputera Agenda Steering Unit. SUPERB program for Bumiputera entrepreneurs with innovative startups less than 3 years old.',
        url: 'https://www.teraju.gov.my/',
        tags: ['Early stage', 'Bumiputera'],
    },
    {
        name: 'PUNB',
        description: 'Perbadanan Usahawan Nasional Berhad financing to develop Bumiputera Commercial and Industrial Community (BCIC).',
        url: 'https://www.punb.com.my/',
        tags: ['Bumiputera'],
    },
    {
        name: 'SME Corp Malaysia',
        description: 'Central coordinating agency under MECD for SME development programs across ministries. Offers SME Investment Partner program.',
        url: 'https://www.smecorp.gov.my/',
        tags: ['SME'],
    },
];

export const malaysiaGrantsSourceUrl = 'https://www.mystartup.gov.my/government';
