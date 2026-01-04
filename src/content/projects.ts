import type { Props } from '@components/ProjectItem.astro';

// ML Projects
import CreativeGANLogo from '../assets/projects/thumb-creativegan.jpg';
import GANCreateLogo from '../assets/projects/thumb-gancreate.jpg';
import Text2ArtLogo from '../assets/projects/thumb-text2art.jpg';
import ClothingGANLogo from '../assets/projects/thumb-clothinggan.jpg';

// Electronics Projects
import AideGlassLogo from '../assets/projects/thumb-aide_glass.jpg';
import PhotoSketchLogo from '../assets/projects/thumb-photosketch.jpg';
import RoboconLogo from '../assets/projects/thumb-robocon_robot.jpg';

// Web Projects
import LegacyBrandLogo from '../assets/projects/thumb-legacybrand.jpg';
import IstaidLogo from '../assets/projects/thumb-istaid.jpg';
import HazwanLogo from '../assets/projects/thumb-hazwan.jpg';
import DSCUTPLogo from '../assets/projects/thumb-dscutp.jpg';
import QuoteGenLogo from '../assets/projects/thumb-quote_generator.jpg';
import MerchantPortalLogo from '../assets/projects/thumb-merchant_portal.jpg';
import URLShortenerLogo from '../assets/projects/thumb-url_shortener.jpg';
import TwitchTVLogo from '../assets/projects/thumb-twitchtv.jpg';

// Mobile Projects
import BustimeLogo from '../assets/projects/thumb-bustime.jpg';
import IOASISLogo from '../assets/projects/thumb-ioasis.jpg';
import DotHitLogo from '../assets/projects/thumb-dot_hit.jpg';
import CubeRunnerLogo from '../assets/projects/thumb-cube_runner.jpg';

export const projects: Props[] = [
    // Machine Learning Projects
    {
        bgColor: '#2d5ea6',
        href: 'http://decode.mit.edu/projects/creativegan',
        title: 'CreativeGAN',
        description: 'Conference paper by MIT DeCoDE lab accepted at ASME IDETC/CIE 2021. Automated method for generating novel designs using GAN, combining novelty detection, segmentation, and generative models for creative design synthesis.',
        labels: ['ML', 'Research', 'GAN', 'MIT'],
        logo: CreativeGANLogo,
        logoWidth: '5rem',
        customOpenString: 'View Paper',
        year: '2021'
    },
    {
        bgColor: '#6e69cb',
        href: 'https://devpost.com/software/gancreate',
        title: 'GANCREATE',
        description: 'AI-powered animation tool that converts scripts into talking avatars. Generate unique avatars and animate them using AI motion transfer with face portraits, 2D characters, or fashion models.',
        labels: ['ML', 'Computer Vision', 'Animation'],
        logo: GANCreateLogo,
        logoWidth: '5rem',
        year: '2020'
    },
    {
        bgColor: '#e85d75',
        href: 'https://github.com/mfrashad/text2art',
        title: 'Text2Art',
        description: 'AI text-to-art generator that creates all kinds of arts from pixel art, drawings, photos, to paintings. Generates a video showing the art creation process.',
        labels: ['ML', 'GAN', 'Generative AI'],
        logo: Text2ArtLogo,
        logoWidth: '5rem',
        customOpenString: 'View on GitHub',
        year: '2021'
    },
    {
        bgColor: '#d94c7f',
        href: 'https://devpost.com/software/clothinggan',
        title: 'ClothingGAN',
        description: 'AI-powered fashion design generator that creates and mixes clothing images. Control structure and style, edit attributes like color, jacket, dress, or coat.',
        labels: ['ML', 'Fashion', 'StyleGAN'],
        logo: ClothingGANLogo,
        logoWidth: '5rem',
        year: '2022'
    },

    // Electronics & Hardware Projects
    {
        bgColor: '#3d9970',
        title: 'Aide Glass',
        description: 'Smart glasses that transcribe surrounding voices to text on the lens. Helps hearing impaired people communicate using Raspberry Pi and React Native. Won Chairman\'s Award in 42nd Science & Engineering Design Exhibition out of 160 teams.',
        labels: ['Hardware', 'IoT', 'Raspberry Pi', 'Award Winner'],
        logo: AideGlassLogo,
        logoWidth: '5rem',
        year: '2019'
    },
    {
        bgColor: '#ff851b',
        href: 'https://github.com/mfrashad/photosketch',
        title: 'PhotoSketch',
        description: 'Hand-drawn sketch game prototyping tool for Hack & Roll Hackathon 2020. Transform sketches into playable 2D platform games using OpenCV, Flask, and React Native.',
        labels: ['Hackathon', 'OpenCV', 'React Native'],
        logo: PhotoSketchLogo,
        logoWidth: '5rem',
        customOpenString: 'View on GitHub',
        year: '2020'
    },
    {
        bgColor: '#364a55',
        title: 'Robocon Robot',
        description: 'Autonomous line-following catapult robot for Robocon Malaysia 2018. Features PID control, mecanum wheel integration, and precise ball-receiving positioning using Arduino and C++.',
        labels: ['Robotics', 'Arduino', 'C++', 'Competition'],
        logo: RoboconLogo,
        logoWidth: '5rem',
        year: '2018'
    },

    // Web Development Projects
    {
        bgColor: '#1c4587',
        href: 'https://www.inspiringamerica.org',
        title: 'Legacy Brand',
        description: 'Product subscription platform for rebuilding US inner cities. Built with Jekyll, Firebase authentication, Cloud Functions, and Stripe payment gateway.',
        labels: ['Jekyll', 'Firebase', 'Stripe'],
        logo: LegacyBrandLogo,
        logoWidth: '5rem',
        customOpenString: 'Visit Site',
        year: '2019'
    },
    {
        bgColor: '#64b89d',
        href: 'https://www.istaidcenter.com',
        title: 'Istaid Center',
        description: 'Non-profit organization website with custom CMS built from scratch using Ruby on Rails and PostgreSQL. Deployed on Amazon EC2 with Cloudinary for images.',
        labels: ['Rails', 'PostgreSQL', 'CMS'],
        logo: IstaidLogo,
        logoWidth: '5rem',
        year: '2019'
    },
    {
        bgColor: '#4a90e2',
        href: 'https://klinikpergigianhazwanalia.com',
        title: 'Hazwan & Alia Dental',
        description: 'Dental clinic landing page with email-based appointment system using Jekyll and Formspree.',
        labels: ['Jekyll', 'Landing Page'],
        logo: HazwanLogo,
        logoWidth: '5rem',
        year: '2019'
    },
    {
        bgColor: '#ea4335',
        href: 'https://dscutp.com',
        title: 'DSC UTP',
        description: 'Official website for Developer Student Clubs UTP, a Google Developers program for university students. Built with Jekyll.',
        labels: ['Jekyll', 'Google', 'Community'],
        logo: DSCUTPLogo,
        logoWidth: '5rem',
        year: '2019'
    },
    {
        bgColor: '#2ecc71',
        href: 'https://mfrashad.github.io/quote-generator/',
        title: 'Quote Generator',
        description: 'Random quote generator using vanilla JavaScript and API calls. Project for FreeCodeCamp certification.',
        labels: ['JavaScript', 'API'],
        logo: QuoteGenLogo,
        logoWidth: '5rem',
        year: '2018'
    },
    {
        bgColor: '#9b59b6',
        href: 'https://mfrashad-merchant-portal.herokuapp.com',
        title: 'Merchant Portal',
        description: 'Merchant management portal developed during Can You Hack It Hackathon 2018 for CashBear app using Rails and PostgreSQL.',
        labels: ['Hackathon', 'Rails', 'PostgreSQL'],
        logo: MerchantPortalLogo,
        logoWidth: '5rem',
        year: '2018'
    },
    {
        bgColor: '#e74c3c',
        href: 'https://mfrashad-urlshortener.herokuapp.com/',
        title: 'URL Shortener',
        description: 'Microservice API that returns shortened URLs in JSON format. Built with Express.js, Node.js, and MongoDB.',
        labels: ['Node.js', 'MongoDB', 'API'],
        logo: URLShortenerLogo,
        logoWidth: '5rem',
        year: '2018'
    },
    {
        bgColor: '#6441a5',
        href: 'https://mfrashad.github.io/twitchtv-online-tracker/',
        title: 'TwitchTV Tracker',
        description: 'Online status tracker for Twitch streamers using TwitchTV JSON API. Project for FreeCodeCamp with jQuery.',
        labels: ['JavaScript', 'jQuery', 'API'],
        logo: TwitchTVLogo,
        logoWidth: '5rem',
        year: '2018'
    },

    // Mobile Development Projects
    {
        bgColor: '#f39c12',
        title: 'Bustime',
        description: 'Real-time bus tracking app made during 3 Days of Code Hackathon. Driver and user apps for location tracking and ETA prediction using React Native and Node.js.',
        labels: ['Hackathon', 'React Native', 'Node.js'],
        logo: BustimeLogo,
        logoWidth: '5rem',
        year: '2018'
    },
    {
        bgColor: '#16a085',
        href: 'https://play.google.com/store/apps/details?id=com.utp.ioasis&hl=en',
        title: 'iOASIS',
        description: 'UTP library mobile app for searching books, managing borrowing periods, and scheduling appointments. Built with React Native.',
        labels: ['React Native', 'University App'],
        logo: IOASISLogo,
        logoWidth: '5rem',
        customOpenString: 'View on Play Store',
        year: '2018'
    },
    {
        bgColor: '#27ae60',
        href: 'https://play.google.com/store/apps/details?id=com.RashadProduction.Dot&hl=en',
        title: 'Dot Hit!',
        description: '2D Android game developed with Unity3D. Published on Play Store.',
        labels: ['Unity3D', 'C#', 'Game'],
        logo: DotHitLogo,
        logoWidth: '5rem',
        customOpenString: 'Download Game',
        year: '2017'
    },
    {
        bgColor: '#c0392b',
        href: 'https://play.google.com/store/apps/details?id=com.RashadProduction.CubeRunner&hl=en',
        title: 'Cube Runner',
        description: '3D endless runner arcade game for Android. Built with Unity3D using design patterns. Reached 1K+ installs on Play Store.',
        labels: ['Unity3D', 'C#', 'Game', '1K+ Downloads'],
        logo: CubeRunnerLogo,
        logoWidth: '5rem',
        customOpenString: 'Download Game',
        year: '2017'
    }
];
