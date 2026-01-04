export interface MediaMention {
    title: string;
    publication: string;
    date: string;
    url: string;
    excerpt?: string;
    type: 'article'| 'newspaper'| 'radio' | 'tv' |'podcast' | 'video' | 'interview';
    image?: string;
}

export const mediaMentions: MediaMention[] = [
    {
        title: 'Dahulu pelajar UTP termuda, kini pengasas syarikat AI',
        publication: 'Era.fm Radio',
        url: 'https://www.instagram.com/reel/DP1KFOJkZjs/',
        type: 'radio',
        date: '2024-11-03',
    },
    {
        title: 'Dahulu pelajar UTP termuda, kini pengasas syarikat AI',
        publication: 'Kosmo',
        date: '2024-11-01',
        url: 'https://www.kosmo.com.my/2024/10/01/dahulu-pelajar-utp-termuda-kini-pengasas-syarikat-ai/',
        type: 'newspaper',
        image: '/media/kosmo.png'
    },
    {
        title: 'Fathy Rashad: A Self-Starter Who Creates Opportunities for Himself',
        publication: 'UTP',
        date: '2021-11-15',
        url: 'https://www.utp.edu.my/Pages/Students/Student%20Development%20and%20Services/Stories/Fathy-Rashad-A-Self-Starter-Who-Creates-Opportunities-for-Himself.aspx',
        type: 'article',
    },
    {
        title: 'Hard work pays off',
        publication: 'The Star',
        date: '2021-11-10',
        url: 'https://www.thestar.com.my/news/nation/2021/10/11/hard-work-pays-off',
        type: 'article',
        image: '/media/thestar.png'
    },
    {
        title: '문장 입력하면 \'그림 완성\' 인공지능 신세계 연다',
        publication: 'Hankyoreh',
        date: '2021-11-01',
        url: 'https://www.hani.co.kr/arti/science/technology/1017393.html',
        type:'article',
    },
    {
        title: 'UTP undergrad publishes joint conference paper with MIT',
        publication: 'The Borneo Post',
        date: '2021-10-30',
        url: '/media/theborneopost.pdf',
        type: 'article',
        image: '/media/borneopost.png'
    },
    {
        title: 'UTP學生姆哈末法迪國際工程^支術會議發表論文',
        publication: 'Sin Chew Media Corporation',
        date: '2021-10-17',
        url: '#',
        type: 'article',
        image: '/media/sinchew.jpg'
    },
    {
        title: 'UTP Computer Engineering student publishes paper with MIT',
        publication: 'BERNAMA',
        date: '2021-09-30',
        url: 'https://www.bernama.com/en/general/news.php?id=2008546',
        type: 'article',
        image: '/media/bernama.png'
    },
    {
        title: 'Robot Design Handbook, Robocon Malaysia, 2019, Page 265',
        publication: 'IIUM PRESS',
        date: '2020-01-03',
        url: 'https://books.google.com.my/books?id=ZVMXEAAAQBAJ&pg=PA265&lpg=PA265&dq=Robot+Design+Handbook,+Robocon+Malaysia+fathy+rashad&source=bl&ots=_SlqkDDV_m&sig=ACfU3U29pysf6--sR7Ipc1sE9wzcFP2rkg&hl=en&sa=X&ved=2ahUKEwirocrorMiDAxVuTmwGHTnMDFMQ6AF6BAgbEAM#v=onepage&q=Robot%20Design%20Handbook%2C%20Robocon%20Malaysia%20fathy%20rashad&f=false',
        type: 'article',
    }
];
