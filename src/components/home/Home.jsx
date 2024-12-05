import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Detect.css";
import { v4 as uuidv4 } from "uuid";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import {
    drawConnectors,
    drawLandmarks,
    // HAND_CONNECTIONS,
} from "@mediapipe/drawing_utils";

import { HAND_CONNECTIONS } from "@mediapipe/hands";

import Webcam from "react-webcam";
import { SignImageData } from "../../data/SignImageData";
import { useDispatch, useSelector } from "react-redux";
import { addSignData } from "../../redux/actions/signdataaction";
import ProgressBar from "./../Detect/ProgressBar/ProgressBar";

// import DisplayImg from "../../assests/displayGif.gif";
import { FaCamera, FaImage, FaHistory, FaInfoCircle, FaChevronUp, FaChevronDown, FaPause, FaPlay, FaSyncAlt, FaPauseCircle } from "react-icons/fa";

import ReactPlayer from 'react-player';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlayCircle,
    faPauseCircle,
    faCalendar, faPalette, faCalendarDay, faCocktail, faUsers, faUtensils, faHandshake, faHashtag, faHeart, faVideo, faSurvivalKit
} from '@fortawesome/free-solid-svg-icons';


import { getStorage, ref, getDownloadURL } from "firebase/storage"; // If using react-player for video
let startTime = "";

const storage = getStorage();





const categories = [
    {
        "id": 1,
        "name": "calendar_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 2,
        "name": "color_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 3,
        "name": "days_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 4,
        "name": "drink_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 5,
        "name": "family_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 6,
        "name": "food_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 7,
        "name": "greetings_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 8,
        "name": "number_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 9,
        "name": "output_videos",
        "bgColor": "#98C1D9"
    },
    {
        "id": 10,
        "name": "relationships_FSL",
        "bgColor": "#98C1D9"
    },
    {
        "id": 11,
        "name": "survival_FSL",
        "bgColor": "#98C1D9"
    }
]


const subCategories = {
    "calendar_FSL": [
        {
            "id": 1,
            "title": "April",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FApril.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/April.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3abddfc4247891cf1119529f47b72d42f8ce58e75ea30c1309b2589e6fd41819e2d35487361dafb32ba3843f751bdb4c07c528904178f54ff7e8690518be7d4c8269e3c399c92511355a7605e1ef0d411c1eef7b165f266935b92740430acaadc5fd60b3343423cd8297d24850c7b68f6d3f427904fad5c86a8e39b043363617bd12c113fca9d8792e595d0bc59e5b8822124d0ca1b181240214884153e83252015f756c90d5a60489007cdd423f9eda2b77a3e54013adaa53602eb811844d7bcf2ab80445123d576961978d151183c0cd3ef468f382cc5838761c6155572809c095db4d133987f614f844e5d24fa97b6c32c9cd8a962ae9b723f01e730ee2ec"
        },
        {
            "id": 2,
            "title": "August",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAugust.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/August.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9bf76dd7306b7c974e8232d2288b4ba7b46107cca2f5b52f6fd02b1910bb0c18a9b8b5f7074918b70fe48c22ebb09aff56bb89dc403f5c19d7f0492e5cbfcce4b7f39238a6cf0de461dec4fd680f1721ec4e01087ea670ad031a1e429286a68f3289c2302b6967fec1c2802b8fa5489fa692bbad67c54c06d82f75bdf02b509cd0777bddec7b0de4c3a56280cb0e221a832830fa72c59eb59f31539e408e316ce1d779ed7fb0dfb348f9f8c7509829328780af4461003cefa299dc53839c52ce2559bf4a459f91bec85d6b71b49be7cc05d39dace9cd6e700e378c141452c5080cf0d842813251e11c347b261daefae4a2617c7999ff047df7fefa7335d30353"
        },
        {
            "id": 3,
            "title": "December",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDecember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/December.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7279571ff086ba40b67ce8a33a3e750020d3e49004a3186805ace631092a724ed12cfc32f5f0df3c1ddc1c80ba00e761488d0aac9f201c70c43ae374140fcc50d90e293d37269f94fe30df0e9b705993ccff141fb011dab01632f2161702bbd99107845ea09c0c42928f3157570f0e8817afb8f1af870458df5483e0ec36517d2011971357cbd8a3f3fd423e6aaca987873b08b50e0b4ff8185a7b776871c094088b41e10c9bdec1722a58929342453c3a87d6cc392a5dcf996819e90730844a706ff96904e6b0fb77a3fb0c4ee9125aed0a6070c29a9c66c2ed9e0c8c4ec0469f7627ff22ad9dce6d8300b7f809cc5022b76414bd827412c9a59b1009d7bd33"
        },
        {
            "id": 4,
            "title": "February",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFebruary.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/February.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7039a383a5d5ecf728c21d39729ea178c5359b97049df4e0302dbe02e3d6ab11419e9ab43f719da015660425e5d38002f168d77d15154aa23c918e2157e71e599aca8c2666718ebf6dad91b05eea679661bcd1120fb4a6fda57d7b18862be9e4c0d79a9f693500e14fcd791a35fdf85d4902e5ef6d9d311f91ab169b9198100840083207da296d713a4d376621ee2ad46929a40e7a3f30ab8647ec82969c7329c1971ec67bc8401fd34d48ca9fec83f36554c2ce2e7175e7acb5aeb9a8cdbf2a1b67f990604fe8b2911cea5177176fe616e44fbd59130c2f79bbbc859c499faa3734aeed0bb3052d910396349185fd822acd066844740ca2762617c2eefbe449"
        },
        {
            "id": 5,
            "title": "January",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJanuary.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/January.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=303aa23ca04811072e1fae89fc82ea14882017d5d8a1faab93ae20f8d01598111af1e1e619d2e1d8fbfcbf40868cffaa22a2f8ed0605349340b7553d548b82f45252bb96a31269ff807c1a48f77b7b138833161b68670640f6b9cf3bd112a86f47698f133ad8c6dc8d08cbf64b6ba034d738183296030ef3b6722d70c63e5d1d8ed88c6e46a16581a3042dfdaaedf23f062acf177fb97ec8dbf7c9648dcd7be3a7b554e4143460c96a72ac3b19d48b5c0dc32d0ac7a741547311be3ae898ce123faa01a69344d18df141767cdbe062801eeb788e4e2dc7f3ee0824bf9752dc66c78e5dc303b0df4ea73a9359a459cffc524db7e3dc2cb4bdbf6a3b8aef34dc9f"
        },
        {
            "id": 6,
            "title": "July",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuly.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/July.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9b82ba99b278113964f60d4baa695e92cf3b11d65c8782675a0f39cde8521614894579f46ba68c7d1b92e7d9d46d6e5933634806c70f6366c7116ef245fbe0172f5776c0c41679bafeadc71c87fb5ec3186ced55ef7dcbca0f2c6f1005fe74446885e18c6310d4cef7d1a0506394c833b69d5b09964f9585e286874e48371341268b09ed7684cbfad0d960c4e4e0ed08bcf910607053f846c430f0844352f99e9d93feb40ecb4c5838c739bb237bd32cc410908a0aa48b8bea6fc60e648f0e6aa6bf33e2091ff0b6dd6ba2679f74c193381281700f6dd1c0d500ad7dbbf4a1d67debed193276e657ceb494a4ee6e006be51bf900da44929217a15b4f01f69304"
        },
        {
            "id": 7,
            "title": "June",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJune.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/June.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=06edb46a384cd20e75916dc4971d1bafe3174cd96fbab101c240c0f359bf6f3da35be8d87a1a2bc4d629c29b7b716745309dc37f212e16fcfc7ccbb596798f482faf3a8c8ce89cb0740134b678c0e401301963d53992c30512d03f7da4d09cbb8196e714c2fb5bce90da5d1e756153958b4fead2db4c6d6edcb6aa9154ff3f9495fd31fc87248896e5ea2a8c721ebead96a160ccf3ba4d96b50e439d3efb7a4e6ac72c72b4e8382309eff089dd876b3ffdb12b16d1a4132cdd4937ec628276b73f5bc43994b194c33e7bbb14a846899246ca47e657e83c3bb3a41cc27cd16666874475a1d6eedc29a35ec899f8f69d7938832fe6b0233306d075ee7f61656245"
        },
        {
            "id": 8,
            "title": "March",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarch.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/March.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=59aee853fb5a62995c88aecf645e5a0e62bd83f98584afd8af6339aad501af1f68cbff68513fe183263cd26bd12f759690ebba9db2a02a4d490cc6f02c0e0c3919b1d81586fda8e7b53b0d2decd13fe51f4dbd28f4ef75abcd1847045b3f3af937485831dbbd5dd3f3577141df861a66700d7d6f2d24f3c949e53779722e1348bf76135838412917670e7feff9bb05eefdee953e2425a4a19274e39f665a1a8cf9ebb987588c34d837c3f86db74f06aebf12392767022ed6e53e64deb88c43cb0472a7c21c490da51da4898280682f06db4be4e1979af8e382521492de74fd2a67ac25f751786110bd0719ab9b327bdce87907db4e573deb2e6ac0ea3a79284d"
        },
        {
            "id": 9,
            "title": "May",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMay.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/May.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5df2010402f59175941657607dddfb3e3ecdad3420020d46366778275022c19e86407d0f4ed3e4270777607e94a539f8e5e6e0f123b344c72067bc3298ef3c68d227eb7c3a5488de9ea453c485dab04771aedd341d57feb812c6f1d6f3622d5acfa319b556fd7feec8d8d4360cccbcd66addc50b4bc3c133aff86bcee14f292e753e99f2538c97b574dcb98b8b2ec2b079137bcbc1d07a3ba2ed47db7f4b2a9aaee08adcb76d7a774d41c0cd73f8db55a7f86fb79c9940fc869896b97d5f1b23ecf99d0f418f1ba7a71a0500b7919610c1548f9591fe42d81b3be7f83c9ddb47b2419957fe6a2a39d7759d0ba992c9cf9d4948cb765627bbb7ed2138dd04d9d7"
        },
        {
            "id": 10,
            "title": "November",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNovember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/November.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=825218a219243ae539fd2365b31870293c6d07b9f7d91244c86b9073c60995279b777df84791b8dac22b7a3725acae44078a0d704208de26a548202b220412b938636ef4fa643405f7ed80b4d6f36733a548836c0f2f23d7aac68a02161862c57858100e168e64ac66c0df9747910de0eb8ef0b5aa18a36090ea6196e92be1c7b16825a7d42866e1ab8ac9e5d04fa96532fa0128ad6809174f421da319fee4dec56321f7d1ef10d497acebdef3a5d9615089c21d5ab0e12822837d37cec1400f00fe5a0dd6d954589e98ee227fa11c173636c5dd67b7da77c5c3cb5908dc26051c919c8f640612913dab8dfb443a3765ed254150187fa5cc2847cebb6915b928"
        },
        {
            "id": 11,
            "title": "October",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOctober.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/October.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0ea2e53b0af873730524d139728c081494059c10657330560b0dc298a15736da6b395ab1ac63e4fd2847008610c43c304f6be8c00db30ac55a08b62d1d152ddf583bd672a51e24f7956f29ede90e4d8aa4b031d61ad41e8607300fa4bc131e899065514b9b3041fa241062db57fe284fe143f737694109b93874d1d36e1cfa0e1873dc1dc84921921b3a3c5495d97d7f39f09774dac87fffa037949e8e5de0bd2d11c89642b2ebfd8b3f8f235d5e96e8c2b0ffcce8164855b8be89f1f8114c2782fa703cdd16d0bdea773a88f98853892d4d6e3b53c7e13537ad0c1eabf5edfa884268a54834f2fdae4b01b287c3735c15bc440d4290fa66bf7e0484b45b7f26"
        },
        {
            "id": 12,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 13,
            "title": "September",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSeptember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/September.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=78c696210e2b54dc4e4e9872fd564ed5c0f9a38b9b5635098b7bb317018f661161558f5319ada8fbbf8a56162897ff293ec5fc85d51a838e0fd2b119dfa86b06c7dabb5e9692c5c89c1e4bc2803de1bb2fc3d4be2145fee6362a588d2f0fe4c0a71a9ba8b262101839e5c85ff7f4300f36ca89959f39c29896e1794a2212ea9ec53ff8db33a035e3cbe2ba0a05482935be02f7944f67a6b37d8c6dfc34ddbf65d6570dccf1086ea4542a6638f667d418fd77d9b50c8cad7582410dc4199ae24ff556432b56ead5ae90f41950dbd231655c0b029f91c999c467256febb6c50a1db2b6fff3489d34aa064dd1418faf79c7351e5b46c27fed7837c9e1e45af80764"
        }
    ],
    "color_FSL": [
        {
            "id": 1,
            "title": "Black",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlack.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Black.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0bd3f091b0f1214231ce0a58e1c868e52a6f6a7d950729bb2b0688ee6a6ab86ca91ee14dfea1f852d4a0f73a179f012440d71702ae5ab5517c8828cc91f5bd93d790783a0d016a525c944c6399ece63c9527efc2afd2b43eb02771d2beeec38851aa613778a2edb3a4ffda7c65abdc23ef0e68eb39f32ffcb8c6cca85cea1d0aaeba860619495ef0fefc24e12b3d0be6c494c25ab1c0b7fcad3fca5c39cf90a308135e82af2d7c02eee9f85d17496b4d5b5b33e66ce77192ff6a8e435970811a366b9d8a0a87748e1e5a280907b8a2f1d6898fa9c7b64fc328802729631747772b496b63f6b3dd98b0939f4e7fb73171a9192c859e7b6835cec34e6fc9f57d8b"
        },
        {
            "id": 2,
            "title": "Blue",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlue.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blue.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=38edcb69ac2001d6ac6319dde35a9bdd6983f57a5bfe65e6348c79ead1e790ac3e74aa4f68aa0ea9a658aca970fdc8038b4011d75e8c4fc334f78b4c31a729bb719ec1f703ba7f1899a291db0c4f2745348b6c182f46fab59a2d0e3e3dd50a5b00c227be1de3838549b1a25fd92946fafdb935526311bf237bb33337d5ed7adac9f500c9205343135303a7a0eb9e44c6b8cf97b7820bff4e867a8879ee6938002a6e51b4a773c41420f1d3e9f2a1bb55f25a8cedbe533aa2ce53496b7f6d19323fe7bccd8312f8981192cad9f16818daea1a330f98f957e5fa2cd36a4f38d3f65ca184fd72bc0fe30563f86af90ce8f422ad32470d182f5c2bf6b29eb68f2e8c"
        },
        {
            "id": 3,
            "title": "Brown",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBrown.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Brown.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=52bbb5540164b4a8f123b50696a036c0a3611c8b386e88c4eccaea5be448026080cf8ee8e7e94d82142d0fbe2d5edf5ef13add68c29d0d158ee314ccf349a5ce606fd4cbe07701b84d49353039de2582e40785a0a9e9d7210005371af50705b197d66441d56e91888779ed922d13bc5c4cb0318ca86aac79e49be2ce496f98ade55d980e5b7cad2a11a4719fae6b8795719d7f1b1cb7e637a69d045794661860863c16aec70984bf612a9bee2bcddeb6b304bb1adb4a084e4e76488d61953ecce663f5efdeca1d3ffc85fdcff22c17f6008681f06361494f1bdb45d50decb95a7eb0dc845438337f07f85ac69b6add1141c5d87d695d48badf1e3ed5d4370032"
        },
        {
            "id": 4,
            "title": "Dark",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDark.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Dark.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=20c5b82041a7805012474bf88c85ad189dff51b67e9ee11ee27365c903ca70ad701671a3918d1731720d858477bbce2fd8563281224c18c2289f03d377016ac39ec8acfb112f0376f9a9d054bb326b27fb766e98e12ed20b1e2453786e436c36b94a57e46cc893f82f9a9f78b753015e03e54c2e0734efae6f7fa8ee9fcf60ebf582660619f46f211fcb19490cea0a6216b9df129205dca11d53755af49c93cd9aff361c5ae4ab8666ab587e9df477efecc158ce9fba2eeaee09db25a2c9a52dbdd37d874630c19d27064fe8bc4798d9a9ce83ecbe356bf5c771417c2cba38b560a5cf7973e739776462c5c913e2e7390a65f1b745cd2ac1d9c376cfed89c0ab"
        },
        {
            "id": 5,
            "title": "Gray",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGray.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Gray.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a345eddc9e08aca0362be3be5f070b66804e1c2cafe46160b1fc135ae6d8e8fe62255ad56d84e2c629d892c2fbdf479082749e5eed65e7e4a30cc2e137a5f7cc6a30601ad8f278bf46976f6f56193414fffe93348a0958c9e549a09f7aeb95ca025f27ac731cd0765fd865a82a004fc1727066b2bd98c1ed94c38bf6aca0fb01f8d28c0cec27bbb628f2eb990466e30cab3e5381da070ae998de21722548da22d65efe9edef7345c9fa1c03a04e3cc8b20ccc0d87bbd7f07c4de8e7926d885351b51995fe939442809875a907a9b7ca03c647001dfa17ec8fc61a915f26c24945b80897b1204fb570f1fc985c1e4c4642792a11ca89b03575d77648e7b430778"
        },
        {
            "id": 6,
            "title": "Green",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGreen.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Green.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=48988c6cfacdf068bab887667a4508089835a15fe3c4fd4503b9b4d7af81cd206b1d11f195526727316c40e22cb9870405a5a91a755728a8d54feb4a0f070e00472076964a22e3f28118aee664bfd97530d6e247fca2b6dcdf8d8b8135997f6244f2d282ab30b0c8ddfe277ab41dfc7ebf307d6d84c7e2a6f375949324044e57cef043f04e032461012c79d892b39d84b8a922351232a3c1f4218151ded223412b8f56b797d0e69a0779e55a607a05e1e6cef7d5d3252432044115b0424b4d456e72671bcb34359b42c5336423f90d5d629e01e2744ff03a2a79992c7936c7146efcad0da35c0a955ebec1b7f15e44536611b77e97ef9d2bfe7f45a55720d55c"
        },
        {
            "id": 7,
            "title": "Light",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLight.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Light.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=81560692b9955a56f23fd6c5f6a5d224aafe31f39358d0b9e855135ff9702f8a317dcaf02f0e06421a1cf83fc4b9ad6db33d7586db5b7a84099719435f608a2f004dcfcbef92c4f4f4822343a8bb60c2b31924929e19bc4719feaa427e6beb79ccb309e567864a36833776e5406ee1f65f9a6d843082e1e9d3cf3159345a3230bc6e9ee550b53b4449c1f9446febcffc84300b50c0feb221717613bd5a0cc1ecd0ea97feea33b786c3f0dfddb63d5ea271935e185ef4655ad433bf3f29f00517f74d1b914b5d52acb7305f199e380a1db81dccb5b3445384a00cd1351a65fb8daa912da7219ac6d818bede8bab57680ce4e9910542fdeee97169fc4c743f0558"
        },
        {
            "id": 8,
            "title": "Orange",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOrange.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Orange.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=757f552f85cf895bfc11564100b2c938f8882d2fb55d7d7fba0f52224777558aefbbdf76786d42c78a87973a5f43c08aa222b222a6f771c1f78c21ee551f8d99a8bcb7d1574cf7d477d94f9ce4cf602d0ba1f4b92184fb25b710c31694d047fac2c89060efedf7ccf26a89da2e2f1838d89920abdba99bbbc9098c48ce728f2fa831c6502990474036edab00745d3700906d089d0a26a50650563547bc576981ac2b81a1be95b924bbb4800fc63e89f308c566e626ee630c330d58cd0fb4f709b0e4413bd3958e662fbf7bd6461b3ac9709adb8df69d36f39068f44c855b9d53a6436a145ddf68db79bc7d4568f54c7c3ad9905854d681d6ee02fab1a258de2e"
        },
        {
            "id": 9,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 10,
            "title": "Pink",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FPink.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Pink.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4de11421a058b945c3bb54dd341750f280c06aa4a1e5568dd68a5fa9770ad649f7b1048d4f17a71c10f6e1551e96b9524b685bad0c0e3ac8be98c28e2ff9cb1b8cb82be81a847fbee9dc4e109f305000f839176e215097c7f796ffd621bfa89538bd431be01ec4a2ff8a124e5345609a64c5e910766caef82c03e851592aefedc9cdc6ad1734f28e7166bdf36f6326178e4ac8e2f20119d69eea30f322774dfd6eff0583d0b0f41068b1ef59285d55a16cb57817411c94f9e63d3ad7879695e59b6d948e4610c55f52922a3f050ca94de339c14c75c8b13d4621b60c8dba957026eb5a97ca2ca1a89f7b27e4929fd982460cca53961a47ee7fe488a2e21cf5f1"
        },
        {
            "id": 11,
            "title": "Red",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRed.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Red.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6db8a0a450ce60ac7f2c97c50888fc4c043f45b8243ab8505e10f9b6eb43deccb666c239a09fbb520d2816700723a2cdb2fbd92b7b34f238adeb52b7d0e5f77aaf28b215f98501634c1866b9823ab365bb524908b5591667b52781f5d62743e8e4e40f963935927c63e162b52f2fcf6f583a1bf512ffd2a0d6c26c430b8fca6db4710c40cbe8949351ad09963b68478c5e5751a341e984f2d04d45de4021a28c641fbfd81ffb7f654124e4d9bb6555448e4c301bda457c73bce39e983794bfae77ce42d75e534f1215dc4ba7095c251f700d3ccebeae1414a764b5caf4408c1ad93d4dbd5ff845c79685451d78ed72a10a04d158c1c25b0bd2bf8e5744f58421"
        },
        {
            "id": 12,
            "title": "Violet",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FViolet.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Violet.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9877e70d4b3d58db77b1d08eff56d6033592b6634aab1731bf9c2367fc7f79d5986c2053740c782a0c64b07e448c6df52ad27763be3b1a060446d29b070ae1c395d1eeb2a3e3d228b3434d45c1082bdcde867ad3cfebe150226095a4dc4abc1859ccaac3dcf0f1c7946e5225c0de59944c9200165377e5bc980995126506f94d18e3320020b706a73c23af86fd751ce5a03f5698f7ad6dc5cfd1ab9029ce3278d1f64d89c39795499bc1f6f4e5f5293b88148c7be0e79942be65478550df1dc687d5a6212222042f57f0b89aa95f8b9fe5aa172ff676d974f37e790d73a709f00a87646aa2e0da47e2d202d9e857e3bc16398d4156cc50b350e1c95a5909bdbb"
        },
        {
            "id": 13,
            "title": "White",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWhite.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/White.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1249785925ea72ec96e8a4f1b6ab8e5f7d8fe535f83ecb44c7bd9e58ded16ba37ea2b8694283843e754f3ce32376ac5197e6f08f9b13d7f3a7e5a6f30f4a8abe5856ce7b3c64732bd6588a23ceabfa37c4500f7fd33728b419dc6b3d669cff0b45fb43b2fa03594f87e2e3019f3c09bbe9ca413225af4069311e1c838595ca892108e81146ad4bcbff2e6ffcd9cda7ce405fab886d74b11b32701b7cb302451e7001e7b3f239d45e95e5ff44f0864c1056293042dee1034c132cce9656a9636378400bcec3a149496d64bef1f9f4c63956d0396e537ee65d3806a7cf02d64570b42a9695a35fe2691eca12a6fa22a18123f260a21456ed32377c50dcda05a688"
        },
        {
            "id": 14,
            "title": "Yellow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYellow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yellow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=83968445ab47a83205c4e862a3f4fcb32926e0ab27cd4bc88478b2ecf97a225c5407017dd6a343af0e34de17fa793f802e8c1a379cdf82604e96c2724193d9fca6908187f8cf088f72f1a0bd682556dc681380c66dec4644adf1af3744def804c0c2d576cc500a2a8d952e300c341ab77b0d06c9c9bc87405c09a4edaa5aa718300d187a8c8886466637c2f8a4947be5b6eb43f5f1d9b85a7dcf89e361496bc016261f41c4ed3b60c3f96397dadc73bb39527aa116f5b2fdc91e46e17c86a2e000d553f374c04d13f4067c5bb4d572b6fb435b8570618695cb8bc529dc0b94d5dbe05208381daaed4e137c99143bd5b6e05911ff4e4e0c5266e91c6dbacc3cab"
        }
    ],
    "days_FSL": [
        {
            "id": 1,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 2,
            "title": "Saturday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSaturday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Saturday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=800585932d9c27b30449c906a140f957456651db01b71ec9fd60b5dcb604ec5fa46e3f8a34e2d9e29f1d1d7bdce89f96f3fe36ec50728e8f52f7e6e9a3a0cc01a6d7a944ac3fd5a7e24a64329da7e3d7674bcbb88a992883b132e93e33ca6e6457f78813912e978970003ecb43061b9f89532e35f8e3f34511f5883f848144635e1eac743bb9ecc965f9c06671419e29cfd1e54dd289432069dc0107a57e6150bbb3469fac93587ce37099b43c12f8c4df7b7fbc3b3e36f6802622ab8c7c55f466f0277b6e3dff511ff8956b6a13519d910684c4d8f8ea11f44ee8f1e4906c23e4a23c448f8c7a6bc1920cf54c4d03ff126a7723695db46afdf3a646fa74e39b"
        },
        {
            "id": 3,
            "title": "Thursday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThursday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thursday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=142f7616e0fb2159d1f882f444f0fc3ab770c997c8994d8349a52efd015ce45a1768f053ca5f1f71c50b42fccaa025369562c5cb57a4e78fa55b065258d695a9969bfe9d366b8a153398683f638deba17455db9db4b4e38056bfd2665cfaf5b0c5d72ef32bf44624c8e140e274904caf468f097455829f5a104be3504327db99c12c08a55ca3399987d6b10df132d122a280c136a35499259d3bee2566a75ae98181a066c44bb3d685327ffb39def0d894337edc72cc0493bd05bb658d0f92d9bc595887fb58d595961477e51f12bf10accad2687d70adddd1f3565101be666044bf21f45fe5463cb5727a5eb651bb85d0e0b674f67e7714a34a7dab9bdc09e2"
        },
        {
            "id": 4,
            "title": "Today",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FToday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Today.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6ea781022818c85b6139a479f02bb0b8af19c380b10da3b8464b3eb209ccf7c44496ce731082b281ec448fbefa09c6bf0dd9d6ef626e87e4ba927a9e4c00653bde8831fedc188617cb93d23cfed9da2fd3d5e27f3814230f7e1efe3b869c8f894f9e3afd30760c6bb3538d2922d08711c5b1492dcd030943b014ff8fa0a4955ece716792a3bde97f98b4fa2224e856f0494f5fdaff776518dd4b240ad51c1bb007d5c080ae719d2d6d6671cd0e28c83342a9e021943f0d937be80b62aa9d14a2570904ed72c2575209d016e2c83c4a41a2b82dc63e45ea33d73685498be0c43bc5459195f5a4db20063dc29f047c86a5c502b1bfa675cfb16db25e3f5efd0349"
        },
        {
            "id": 5,
            "title": "Yesterday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYesterday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yesterday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5fccd2bf9f13dfd9625066d486a022ae48f0a1dc03afd6dfa7c4dfd50ab7da78bf90b2681b1c852094c0a16197eabcbeb27d1fde5a54fa2fc04bd2774480c37a528283c007b288f1e2fb28cb7d2deb75827d2b3fba5fc9ee8d053ef7d06f945a90a3b15d6a6dc411f341a43062e7d2280a6c72260afbe933001e8aa24c0bd5177c42f412d59ae3840b257a4b4a0667f858d0241471f0a498f6d7ef18824fcba5c6128ba20b090d489359e337e57d2982c7a1221b44d8d294782570749c4af1c70a2a05e9d9ee7f0c98ef683003e10ca7bea79829e63166cce517a3eba47675286f8b4ac182911159c3d85b49816514d97aa6c2562d6e8947e0582da9b65ebcd6"
        }
    ],
    "drink_FSL": [
        {
            "id": 1,
            "title": "Beer",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBeer.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Beer.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=15940e90cc79e171555bbd093580aa94700d939cdd46bf46f149634f6e52318c306d4c88c43afb99b35858bcfe90252c2cf3b810b20a169733f14c83da83955e76e8b8371d4734bf1d139bd41f3ad2fc10cfc80d69828dedb5edc447e47f7a3e7aaab7de83d5b596332c40ac55fd48fd90526ebfc21266d2c9815024ed071eca67d786a8d5bd604660e24943d92c1a121350979fb09d39224039b7edd9358fae19d99a9f655da5f9746f8a7c341faf0af90c55e19c81be76cc6b7c5d01896b2b5e667c06e5d10bfefb4ca81c4f8caffd346ea685b8dcae9dd239845817890c5ad4b423313742aff7296828fe3f413e5c38bcbe6bc5bd24c5eef8ce35a20d9a35"
        },
        {
            "id": 2,
            "title": "Coffee",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCoffee.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Coffee.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0637b5525e108d44d46a8d7016c676f31c4819884f0c157901bc8c95b9911c8fcd97469d57a582d751b1addac8e36a9ce89e5cda6a913cf7b4d831b3e030c7dbd2de077bcb63454c03d1cee64313030d8209b8f28cc1b256dd37c3ad74935336384678d1bc6061d498c45e67b56755cf7704db206c67911f62598c1bd28b5ae122893bf56117d8a1aff3504ac097db28193164372c0d2ca509f5c9bf0e26105fdc59bb72c162a1a43ca701620a7d6e262d3a5ebc0d3122d232b55d83a4670ae8656bf8c05344b4ce2145094c271949d114332361b79b94b2511cc14fa74df0b853f1ca2e468cac025896fb591a2eb502f501b479559331727f481f82eb454709"
        },
        {
            "id": 3,
            "title": "Cold",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCold.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cold.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4d06570948334b1577f90cee2c33c9dc8acfa8a088542f9577e55b8308fbd4b8892dd934667a3732331dedaba5252509ca490b49f16c88242d352f72dc1a1479395d6fafefc5fd7f74fcd98571ef5d25650a6bc8f33c2f903f82cb1c9b9971130d87d0ea41e46090e7d9c6b1cb3e95a96e373623b03d77275501ecf9de398321e4d1ff75bd9c47d598c2f885ebc5fd8d05c8fd5ccb9aeeb03ced6edf8da3adb30fbe281e7d8f4ef0108fafa5c7effeb5e2d40f35decebee2eb4439d50c68c25b0ec2471a04e54f2ee8b42720d5a039189064f01a4abb4df16368f07f50a254a6cb2264a24763323ba6b74dfa577361f24fd4a125cae1496a5ddcd7fd6cb47452"
        },
        {
            "id": 4,
            "title": "Hot",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHot.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hot.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1712ff3c50f45a95c2a8b800e56d3542802cb83c2c0a5e54c6323e607133c10ba9cfba063985f80cfc1257aee66d5d647b5beb72f66125f42fb6f0fb29e6e57f1a03a362acb80d73a6adb9aefd459d124b111ea6de6caa9512a0ee45f0b42c8bb657ef54e7cecc71cacb3c4fb60dcac14bfe4c76f80a700d4aa3bb2dd2f8cfa4bb09c58ea9dcab57d831c382e891bb955e9fc06b4ae234c2c36a1423f2fda0b3e9aecc7c18cb182712215a8ae6de261330623dfb17c84487358ef28362c1d528938f4f3afa4a788d5e5a090f46e612a828b4037b6b68ae3b10f5c73297f5b3ebe1515fe577ef619e82a61eab53ecd6b6c1c60bbeaf006d684b00fa75c84b0280"
        },
        {
            "id": 5,
            "title": "Juice",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuice.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Juice.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a21dfc0190ec79b5afb8a6869cf99b4ab2fa94fd5fed5ce0b46dfe81f5e9c481240e84199692f2c6541e56e7a377625e439ed2db3a44613f9d806280276b934074759271c1a34d6c49fec1c495f1cfd456be57dd3eb2bf38cda510e80c02169d06fdcc0a94d7a7804b49e464ae6c9dc8ad5604e1a0de3ae2089528ef4049ac0f93bfa8aa1c440faf24686edff5a823596bf52aa0550f5158f4da513eed4385508547528e1e909d6fb5e7e87247d21376de4eadf34443bfb9a6a867e464873bc3210d908de0f27d721fd45b0f11d4e08938d09a4ed63b0334686d533f3f217b3ae110337a5c1d80bb9078595adf1c9cbf969c268948ceb12ce40aaa96d9cafcd6"
        },
        {
            "id": 6,
            "title": "No Sugar",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo+Sugar.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No%20Sugar.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4185a55c4050787270d3356aae2e7b8bbb3e5e18b40b41477b29d5811bf40e602f2e4c2b20c0322be9103aa62e8bcf37f029ba753e465bc9341e1ade0c9a849c1ff2f68b0386778a483edbbc151ed582c46b423923a53e63c3e56fcb9a2591ec0c6e5d6fdbcd3084613d1969023bc8e8e33d23ef8e90b7fbc94c516f4127a344d96b58540231958083cab7f4093159dc439b9fc59fed2e7bc37c59e9572b1ab16c76b235cc33fd634806f80bd60823758db9935ef24e427251a8f45d12738c8567acd99bec68898b2fea00f6a4942daf3e34d64427b5c981d6ce463a577559fcd95558cab03cd091dfe61f78effdb137c5c417ed80883d931573bf734dbd4c5d"
        },
        {
            "id": 7,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 8,
            "title": "Sugar",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSugar.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Sugar.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=35f2a0cbf91258ff81b91c1600906a24df589bddfaccd41636808bfddeb93d30c720b4aaf14cb96911933d8e77376df8337e90240767bfcc0a900cd0d9f3f272d807f298970540d58a3ffc15cc8328fa4e37cb77bf7b50d3fe0b0fb5efa94ff5597982bb1589709512644944608acc08a0702af0c5a10e30e0a3a8d7cd8442b1ce6395bf60283c96d9133517491be914df3bd17c9ce06df2b0517f076b5d28604313e7526b09f3461d0ca2ce64366a052dddf1bc89ffbbb0a3939cadbe8092d747be4e37baa04b1f34dea77af234496c804e6dadc7a771b7ac84ccb98603545b339b30a9b16ed40ae5efb87b916e92c4bdfb24f5e1ce0d90a8cf4dfdbd9237e5"
        },
        {
            "id": 9,
            "title": "Tea",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FTea.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Tea.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=31a4bd696dc51748e7949a5cc05fd1b16380484123f0732c23968c683c50153d82c67695fef2e8f410b0aaf471c1977491c5ebea93d136aba81ab3883eb166e11ebbb256548460f36c1b8e50e84fcfb71cb8c689427b1513ed14c3ef0f026c9428c3f4a9730fc69b86bb80d1baa3f8ee3c5c9be4b759eb8f6304e6b243803eb6c7cb1f34e0c360fd2d5f08522bad8494a16516d880a34045170e4820d86bc2b7315cb39ff465fd4818d33b43701fef829188cdb047eee6e7d07c8980f5e21ab16bf7082c3fb301c55fd35994ed6cbb071d0b042c1e9f6286cdf97c53dfc9cde7c5ac844f077316e6132db140560ae82e9434e5c174a335a646262ffe6c294694"
        },
        {
            "id": 10,
            "title": "Wine",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWine.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wine.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=78cf45351eacec28782ebe0ddbd08d132e281e824e057e0759f497f222e02b116a396e2b62cc3a4ff2d8b0c07d0ee89c884f93e5aff41c4b7e7d4fbdc8fd218a89ddb028a75ebbc536521de47d7cbded5403ae282a0459da4f8a1ce690f1aab771abc1f72ac1fe44a846a15542eecae8c268eb55a7850b56a099c3245cd6237d2e42bfc8877c8c038b0997ba11e842de50ab37528d0c3338f183c71847c97e44a1082bb7d7f4f4d0d994e4600a701569e04dcd23c03e8d6faecb6262bfcd6bda7e01a8c07c77fe3366174851511735237cf4d0cf188b89ce219bcce4d4c8c19be4da6cfc4c8c4d5392d1897e0e57186960b5aa684e97b328a0444cd4e2aa37a1"
        }
    ],
    "family_FSL": [
        {
            "id": 1,
            "title": "Auntie",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAuntie.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Auntie.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0639888ff8437a64d0947441bce8c984bab6f4a108056590cb0a36bf7e57535371ffc7f0dd2bd90505236eb3788c13b162ae0df55352815119f442fcc905ea80fe17cf7c8c4d83198f6ef892a726d5928641d07e6ca9f2b3887203d1eb61af94b67af89d889b92f0e47f18763fbf194824a85f9c0b3b9ce7a386cf702739f19ced2d5c357c7b5569f7c3cd78e10970121092fb8f5656ae6b8984db5be293da7d11008c3230c6b25eefdc56ab457c3816126fca4de1181607e3224c85cac08fc1eca1d2999f7771007b49699a62a4c25bc0273776c9f57fd311e2ee929195949707139c498518de2a95348dba41709b1329352d3728571abda6890852c84a2562"
        },
        {
            "id": 2,
            "title": "Cousin",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCousin.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cousin.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=405606b2f06643f531194527d2d06456981c37390332285451b41d6c481a7a2a3895d068b6d20b446feeab19e44054a56ebb698a1a140d8d2844dc9c48ada086216e0ccf684bd1fcd986b6724b5108240f0944a9e14c8af0802b114dcc3a85f2997e36aaddb740094c36b0f8f85a76fa854fdc9fb1e3d3b598788d38ed9b4955315e2a9ea5690c39f313d086a351056929a67fde3d14fc11678eca3d9da41c6be4cf6df517f4d43df7be855043f720a8f0ee8f6ee390145c953299315fcf3b94e7cdcfefd616c92dfa652a68a3ddd97c897aaf2754b2c9d008c1661935e4bee683239d607da4301b8a40909f154ea4e3b6de3e0c22ffc8a20a197e28ceef45c2"
        },
        {
            "id": 3,
            "title": "Daughter",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDaughter.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Daughter.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1c5ae780f1f71fd23aed1cfbc1b8b5c2aa6b0ab30ca27159e801df13f919f4064562d97113f34a73b90d7b61b7e881e85779e236c854a36fe35ce89d30e2b5b4b7ce4672c9891add5e479de28ca4c6c834fe3d4c2aa23da87341a80da78dc653a0ce22f74f4a91a10c0d31c8fdcf513b9c1fd64a1ea579256d898db6d7b2773970dfb29fd3ad98df4219ef9b4ccedefeb05ea43d038810a4f635eebc1d1a5cf0f328dfe52a9be433e55bdc8e5dab7037d25b981398b377d1ee91d32f8109de1cf5fce1d4eda8b0041a8b5c7dfe4db4e133181bc5cefca9273be9598162c0f25e6e5915f13b0d71700c929d3050cfdc077180dd95914f70cc7bc7d692850388de"
        },
        {
            "id": 4,
            "title": "Father",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFather.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Father.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3d5562832893059dc0f3c34ea64759cad5ead7ef1b37922915e2334ff88aad4db9fd13114a06522abc4e50f1a471a8628b0eb5d2978a16926baa873aafd0bdfdddade51c6ba850297d7659cd3f0b884bce962aaf36161e55880a50f353497130d8d6eb5480d30f12f762860a54c306b93699883ba951ebc8d56cdf6508edfbf996025f4d9fff5a884c4ce1bfce2394f47944d88172cc858f0d9ca5f971e6fd5c4ccf7afce4f5049e1ad6f69e13e6fdb277776786c297fe0e70a2769011e94e564da5c577c1b7b7005fb6d205c475736c07d0c393b2c159ff7ce5d32a8d0f638ccb6699da6271931b8bcb2a1c3883d310f77454e93ac6c4438c1d7df475d58061"
        },
        {
            "id": 5,
            "title": "Grandfather",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandfather.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandfather.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7f4643d5cfa07ac6e48e8f1668198d7e3a17c7bfb6a0a748a4b881e80d74ab49a35e9ff1c048df81602b116a5697fd0b766347770215981eea5a70d65bc663c39cbbe3c45d2fe75206efe9ddeeac9f277991f9c2693623308da142c4810ef2a7b51e51323c707588eb3f6b7c9682df76887271c6dd4a72180de7defda6fe0f0935895cacde5548110b4e21bdefbc56470d092768f64daf8be9bd6c6213a4af7e9f7f2726aa4b35ca1bf758d4a2c5f766a842e4abc63b2a17e3a45d5a725ab7ac48bfc003c7f2aa97c0577059e651223e28c6af9fcb223110fdeaeb5b064e5c8118a6becc8306e6ff3e615704e0546f0d032edc5d309cc470fb09e2ae7b3b39b7"
        },
        {
            "id": 6,
            "title": "Grandmother",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandmother.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandmother.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=499f8d7b729c45500ea0028fbd73d664cba90e80103947bdacd22b9ff6b787430621995fd2d929125af0a6e1e190b2063b1722219a591fc76f89feb39cae6afd121a61efd4be9074a1155fbb024281d0840e12ef6fa1ae0c8d5fd6097a2064ad9468a19bb1703edee0102fce575c5f862757239d28ca43cbbdff1dfcc9d07a9b7858df5ae917ab0fe7a3ea57b458e3f7ced8ace0dde963d89f92d7ee3059851f3439ee9c7e632dd0f52c5e5fded3465b688ce6ddbbd280faf005216f661921137343d03a5100013b8aeb9fb51f5d547ee4c34fcb8466b1b77baf5463efe070e522d23f73d24f174736a46fd30cd55e78c9ec56445b8edb1e85e36f69bcbd2a44"
        },
        {
            "id": 7,
            "title": "Mother",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMother.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Mother.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6a099d9c0eb6cd112f30463fdaac9d58f419ac2ac7c07b554fbc5d83801d1abc82cf89951489b6d11244ed750e4fa25956a920c20da762946df9492e2bc9c53561b30bfceb9687459bc944eeb11c039fd021d53e84b88f5953453d54f7c6a403dfe4d6e21f9fee9e6687d68f74b83d22a09e298b9aad866f822beb033c3876e54fe6a2fd8cbe0a145cf19376cff843f5b76b05d239a0cf7b9ee0faf945d10afea209b98b07d7a6d3defcbe48ec4a41cead81d2a7351d035bad7bf86c58db197cb8a1b1f25d16f4f7f53e3337f7a67bd11bae46bf1d5048211774ea61dcb54eec8de3b890e5a375efcdb1c0652bf30a28204b7f697334e0330b3ccb9132a6b269"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 9,
            "title": "Parents",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FParents.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Parents.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=413e92434b0fc421f475816436d3fbf5a226f5e2d76177be48b552a386ab13e50a1479aa2a6d5635ee26f46caefc76a614d1109b15accc9835e8f6e3a36e6406c06bd1e079607e99e9c39b7bc0ae93be0ffbe5573ee8aa6e01756d7e6464058323012073889acc72140752564d2fde6ae7e714d894d9eb41371021fc21034f6e8e38aebaf9f545cac9eb25eec090ea6424dfcae8d61760a1af56f5e358cba73d36664555857da496d1f290421da2f2d3fa70b3f4e19f364300ee6d4d976b975853d6e3bd302ff52f7f3bbb97b58310d70a8d3fd0ec03117e48c2e1ac474472902b24066f2540ffa8252dea5cfc6cf22d1456f94feefc52a7c4df6d9cb71a39bb"
        },
        {
            "id": 10,
            "title": "Son",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSon.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Son.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a344893555e7aba90efdc3f7b6b63415022853da90ec4c1ae118e15099dad2cc0c9a165c3e1c94455b2ca451b42e410c88ef584070332b67d2fead18c995f3c8716867aa299ee32b7e01a2fbaa2d24b86dc98679ee482bd5f107cf6760313af1888b1705e35a078742f715ec7276c4d3a76f6eb1ec3f3cd4c694799d29e4de3caaea2842ca89176ad21414ed7884587e0cc7210f64f740381127de71cf4e2a5c8c0d9bd92510c099fc18ad3cfa890a4a3eb78658892adc859c95f28503b492dcb8d80ca13ab1399c8a83457b6937d04f39628b72dfcce219157b2442d7c15e04df5e2a4c9f78804951ffd34ff5efa97312301dfb453d4c0619941d30312583c6"
        },
        {
            "id": 11,
            "title": "Uncle",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUncle.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Uncle.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1d2655b0eacf09b576d0e6b0f9b93a9f0d4544a57b71bd6a2f3c4e96f5d162468d1f4466b6a57a67873ab2fc2ce5f20c681caf6a24deb9072a9462da7798043616153721729ab71ff842bb118669cafa67cbe643d1adf1ff3524aa536390a760fd2f4fc191dd55cc321f82ca601e4a8bc5044b927f601b79ca3a1bfd7b22e7d7b6c7e55989b510a813ad207b1412bdc93c1c625a6fd9ebae89869cc25e3b5c23b46fcf48710e1afea096d6089f27dc0cb47d9929f2cbec1ab4fa086bab8d7a8bf28a0401ad3c0e5951d7a0ed507ba926101631309d06983f16a4d8b9e6819f4400188bcaa35d0fdd6183043297c63d91070769012d683d5d0d477ae033ea1f79"
        }
    ],
    "food_FSL": [
        {
            "id": 1,
            "title": "Bread",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBread.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Bread.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=96e12e603a95c21e4a9a336abbbbf31b33e6655678c4fec1885c5288258a7e9a3b3daa814e1a46c7eed7e388db8352d20bac90a286916f38a206eb49a83435551b91e89e0073c6ad7785d774fe44c855c9047cd6cf83896fdf1bf61af5981eeff3d7c0f563a66743238d3232c9c7ff4df47a6fcc28e161850f8c611525f7f69ab221eac0cef19c6b086c8c5a1f461795b33d0ff37f0a2de8abc95aba6f2be507208957c1960261095ff0a09e7d5dc6965ac0d159ed159846af2b07e74fc4b2e2c72ff4f5e8b111842fc28163ff0b355235e8b01f684dac88315ca052ffa01863e49dca7c4e569d723183befa43ec983d8e59181f39efb333cc9b405ede23ba0d"
        },
        {
            "id": 2,
            "title": "Crab",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCrab.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Crab.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=059088a23f7cd74ea532c8943b53da4be299dbc039207f5e5f940af17c28e9aed562084627ee4713fbb6659cc93d902fde84875dbf6bff95f3331eab34a6ab131eb28b2386164da875077248a6db1835aba23a9fb372ef29a1be9d3a04874834fa342acaa6ccff080f6f0786f119b8dccba1e21708174fce1f339be2e1c5155dbf0a2be54e4fa6119512699dde0a3a33bd609cdeaa851e93c03a1558567ece6515d657013593d1f72c50f327f0db1748dea508b80db123867a972a6e3a96ee77cfc73f744c3f4721c89f2666be7afd284eb98356ef8eb609cfc024bda11939c09d2f5174f86f23aaafef6e8fa12934afe1d0d222c186d77ccfbe2e134ba7f2cc"
        },
        {
            "id": 3,
            "title": "Egg",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FEgg.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Egg.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5dadfeedc78f20947938c3cdaa27563306ed77d5369663097a84bc5428c7e4a3db4ad196ad292ce8a648dc2ed134b2aa751875d0d4302964a2deff0ed26988ae6ec21b7ca187342a5b53e909ef12c4266626273212788a526baf58128e0f631354314544fb24ea5aba9cf12320de326fe781ed30d3b241adeff9d40f5bfc1ed49bd08326b34f666e01b60f7844283d261f261609ae9c4461f5ead9759d01c8b8cc96e11119291bab79cd2773446293712ec3677a839c71eadeaecfce7ea8af1689d524294469db8c15fcd9c512835b620be70429cd2ef8f08825c754b5e513edd741e14005de9c0fbfea864897855486d611dd21dd77d300083f191f69d091db"
        },
        {
            "id": 4,
            "title": "Fish",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFish.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fish.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2a0d26e8db6ad7834bed2aedacb8537c0090bb2836732d0087650ab3049ce0ad3c8797edc2e350c4f27e9da57654ed1c4df689c05db670579603121576bd05fc19eb23ccac7dc10c76c1e77137422cf930f72c87729909d5ed4a7c59bcaf37b3b0bad37fd0e8e7a379d6ec8dbb7708125df7fa86032f689902e057c0af29777be0857a22fe3af11a85873855654459cbe2e950a16fcaf44a6df686862bf16d98717df869baa13aa457086217e97dd3c4f7143b73d37bdc684c423c0d21aa571225d49c6382c5c633195ba5212020e85a72186e893e635d23290d71a278a81ed0686d23b76c62783e95fdc80174c93b7b7c97992bb5ef7d56fdb2c71e1fbd215d"
        },
        {
            "id": 5,
            "title": "Longanisa",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLonganisa.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Longanisa.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=406af77aca35f1351b8bad4a825193e47e93b921178e38f75ca1d7dc7eae44f06f14b107f6991f5884c0d5c9c93b86c48d7b9491f1ce607a81a3a3d8536ebe01929a559ea1b6bc9b99a2855e614cd2ae20157a1f3417fbb806a070cf37c15f8acbc1d5d7779bce20446f5acfe401ce67c874fe2faa6897c423d9fbe989981ce19dd873ced14de3f159d56966bc061ebdbb4a18f513cfbef1ad8dbd9799a6adf26d86848e7b725229ebad5ad907df0edd7e44b91acd5aa31c4e24a92fe1c0206ee6aca6bed3e8ddd92bca7d8323aa22bdeff8ff7695fa13505136450ea35dff0b7008d5dcbd24cecb8fa083db20942c9d110c652b8fbcb096cedad9630115db74"
        },
        {
            "id": 6,
            "title": "Meat",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMeat.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Meat.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=22ce60edd4bf9eb52e71406f06e978a8e0720db337a073eb911ef01727fe31d653ac16101f1d939a64fe923532cdb774e32fb3038a27a79b84698dcdcde4513f5fedd54d7ea5bcbcf417f8c7e37284c68d41d51bd6aee3d177b19e80dbd37a2fc66d60c4ae2a5e14a281436c5f2041fc314f43dd5f9d272a911b0fab16c3301073af95f75b63ecb417df7423440dac5b581a197b072d2530d5e7e096ad580a5a39d953eb2f546b24249517e57246bd4deb9010a7b306e187b831d42d5ae6492bd853ba78c6fc4619fcdcf2b351242362e875669be0f5135d4fc8f70b4f67bd8a749cc17c05f4d0b0af9b04cab629181f8ee999477c752874fa729636f02ff15f"
        },
        {
            "id": 7,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 8,
            "title": "Rice",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRice.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Rice.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=45f992486f65658994a381b3272bdcf1bf2e7a17062bf9e75d98925f20132ca1e297b0d0d6adaa57ee36c7821b565a5c92247d50f7b04814a4b81ada8be6aba547150cb9e74922f6e1771b85abc542b4d2f93dd6fa654281f4aa9953b1418458bfed0762db64d23475151b359df27c1a8f25eac18a2dacc4a6f81719d0f626e7aa50e7774d91adf1f5b5204546ea5d895545a919643bdc23f395425ab4e6c3ad0ed90253e20fec405456dc0a2fb65fea85891a3fe28dfabbab47a551b747e6632e389b5966c85bc2618e9557c2101e4b27e5372d6e8739bec63036b783523cc824b4bcadd5cd97a0a789109d8315d69429cc6a87b57d42bfb110f383ec3594b8"
        }
    ],
    "greetings_FSL": [
        {
            "id": 1,
            "title": "Good Afternoon",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Afternoon.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Afternoon.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8a5c9b49b325e990261d0600283060daa11f35f0e5f5af263e6730a66f52705d62864acaa8c56b5e70b5760e399794d559cf162f5bf6e172ffbe8ccd5bdfffc1faaeac9ea8631b46feb3f1c86e1370a3539a3a60312d97afaf7050276c8a5564164453bb366f71bcc069dda3a32bb76c22b2f4e2dc876497f7364469f4631dde9a9befc2462d6b57b81913bbd439b7847cda44a4c5040552588c64a100bf584f60113d3c5c629df87264b918b314da65c6734c31b8aeca05f1b1ac486cadfd7a3256ed160156a7f64ca9995dec6c82aa94c46953323c493846e0fe2a4683f1106fef29a9315230df77a6b585c508a58083a7d6c2f5db44e906112ad90c3c8251"
        },
        {
            "id": 2,
            "title": "Good Evening",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Evening.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Evening.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9e63155933ae61d4c257cc745e839233ad42a2a46a528df6cda4cda36e34e3f7c10e48720497af0817280d870231333629ae6762f0904c3341805e106f83935bf1452c9a0b0ae76a981f4a15bbfa890e1b1507b73ca0a6a4b23ce87b521b11ffef23fe3cd8fb80320e08e8b756ccf7bbad62f1c9aff92abace977d8aec7a566b424dab4e644d87757cfb74466453d1a7ffcc1312b36db7d392ea759d4f3fbc05c923c205fe3856055ad735d84066d933fb6f86615afc950cfdd5a3ca59a0ebf9bb9445aee8cc7912d6bcf0e3148b95908aa8c6ea55b08bd20527979df4cd8cc1def8aa45abb101c9e960c7aab26db93f07899326a874a9cc8046de3094480656"
        },
        {
            "id": 3,
            "title": "Good Morning",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Morning.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Morning.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=32d54c212a258e0b422c825e08041f08c0f0bb10274d4d5510ea5d962e923aa7f717a5ba24926a043450686418694782e1eb5508701100669cef43cea953fde8740ed76c855eaa8cf34c6ce7f7b12fb66ca205bf771b42ae0ec846c80206dbd2116dbf054a2ddcc6896e424a655340db9174c6b4863f6df65a2f750ebf41803d931866dfe5e53bdb076c7dec2f7d080f611edb669e6bcc493e679471affc61164dbf421467519a5af3bcc1b5fed76630c0b57db8e6070f18f1608ead4cc44a98ca6598931714514a79de1ae62f0b3095b3decdeae2f6c208c9a093715118c8492992cc2407eed91c9bc5bf2759ab3a59b5733fcc8977460a31f7f374985097fb"
        },
        {
            "id": 4,
            "title": "Hello",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHello.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hello.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=06495a069c006c996e0f4f01d6a8a53d8eca5669422ed9582da07722336444f93d27f610dc50256a9de696bda8271c996ec2201b5d1c87e6e4eb1b66fdcd82340170f336c0eb9653dfbf06b00e90854ff1ff0d9ed2913d6df45da96cd9a8d1e5244b87efbccc34abe7c52a5d09dcc1f0f4b16b969a3a3fd8e2acbb50ce5035e6cc53fda4532a822156e53c2e6b50799cd32af6d460491a67768ee51f1b32ae6e402f876db306e7a7e36f26693af533dfd11dc150515e0776ad73d980fb3dd176aad0d09f8d6bdaa8ee54c99b92c9076c4cfaf6667c6716a8b0fc21d60639d90b619e1f789b3b24508718e519dbd6bb52b366e302445c277377d620c1585f9666"
        },
        {
            "id": 5,
            "title": "Howo are you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHowo+are+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Howo%20are%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=33abd6148a4f884029b007dcaa091fe47e8e145c86c4f5f824e9197feca7873eee271be46b6d255ab6cafbe139bf18502e01b47cc06ef749f57a68f4ba7e3373ce909246f93fe20eeefe156c866d29278ca0b2ea50e1d15b0f98d1efc51f11fa7a45bad2e7957d091367fc2fef499de131d65cc8c935a6736f918af3e471cc3709b6ab9ee03539b89413880a4bd86ef67d907811fc19d30bdb1ce617536584ca25a8360b7bc2ea6985edff02599b406069eade32f1dc8642d898ce7c6fc8d120922a211f2800d111bb57d94e4c09d0aaadaf0e236133f5942d17c14637a22b28204e0c042b257ed504ee54cf6a7539b6c4441c4eb19a3c705ab0cfc5d250f489"
        },
        {
            "id": 6,
            "title": "I_m fine",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FI_m+fine.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/I_m%20fine.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6bce6a089a12ef121fda0d14fa70090422a029f7768c64db3b1ca1d3c9bd9ef295633f1e41d21bae6d5d898a11c32b0b673729e82c40f691d010b17e6a8557afdd600e40d224739766e87af10d48b2b1f155b71b15b7870f9c9d86ca235875890fa5c54d8ceb8bf78b2cd4cd7874bc5342500d846885bd4768e1494af359f4aca2012fcc26de204301ec5614ad8baf49892101979a0a02f51964e8bcf549c7ba1a542e42e1174cacd22f9c56dd50de1ef3fc25c63f30d318802933a1a0ba00cccf541649dc5391be7900523d5c8d1ab74e86f5335c6da90d515465928d7a201bb22bbbb9767077510b26ab13770476a173c0485f6f532720bec7383038f7a744"
        },
        {
            "id": 7,
            "title": "Nice to meet you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNice+to+meet+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Nice%20to%20meet%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9062ba9279ec2a4f8c5b2026d1115024b0bd231a634462f6e772907ffd048c32e0e9f1e9f7ae7dd8d007606c1cd3333c027ce97a587d9a54302deab62fce99eb001fa3e5c71ca4e9c128cb41b982d2ec1af89ef002c95c974b465a8641af99da88c5d24ed6a74d9f120551fbd773dcca44620372592b515d2aed0356d5259ec163aba7ae684471359020a89d99228f07ef3eef9543d469d03ab34287a19ee0c59038046350c9f75b65efb14900337b9c78b5cb42917f7abbd13f0a47221bf26bd48149fe157dc43729c52612ecd6f49b60805a1746a90929e0861362e34c9a51ed92a4279495195ec4dd8382a179782cf1cf79c29a3a2e94a404b099f72a360c"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 9,
            "title": "See you tomorrow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSee+you+tomorrow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/See%20you%20tomorrow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5c6615d55d72d5f0c622116451068d927109280558a35c3f6eacdefff2a2a7aee987ff648431cac18b985a6018ed81d4a357a99e54a16da43fe16ae8dff92646efafc1a59d54e0b85aad451a9be58d0c2f0d402a7cc8a92899a442baa8c55601c103fc49ea48311abd34e001b9d5e3e5f9708df4912240c4780119f5383756c50f8b5f72297e144fd2d16f58093d59da364c4740658140dda9468b8b9e1a965a54e7466f421dfe3eca2e94f234da5e3300a9c0ee6719a982b3d4b6b1a19a2ea99387c3e6b74794d2aa2e76dcc9f96c5b933c2c9bdf1555ca22927bdc18e9d2907dbecf576963c33ae341f67df860b793e5a86dd4145a79a96ea6c3796e63e34c"
        },
        {
            "id": 10,
            "title": "Thank you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThank+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thank%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=574876c009e51022870eaaa7815de082d76f69fdd58b2daa6dcd1cac76bc4e2e28188f5ab6d7b7b3806029137b943fe45c3349ea95f2153db885c579371a83ff3761442691096cbdca89cacfb7dcf965e3a5d9ffaf09606ebb1e9b6d6a5035aae325fa4891fe512396ae607c9961cdb853b35fa81dc16aaf149ada7c53dafe1a4e555da79d86ecf2f3a80609eabf8e12d8e210515b2c99e12018b94e7da9b04cab48b3c6520b0a0c86d408ab643bef331e522d251735d3be2423c411c9dd3333debd5108dec02a9d5b560f12ce132cd303223d626c60cc1c99aa3f90d911c7a5e1d999ab5da59f0b018fb3ed2d7cfbbefe68dd7ea61d8443d2ce23396ced9f50"
        },
        {
            "id": 11,
            "title": "You_re welcome",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYou_re+welcome.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/You_re%20welcome.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6ed6744d055dd449fe468c261b4784725db1a922b3a4d4012a3ff539aaa95f69dd4564d2ec0c88f92d74ef83752944bda9954ceaf1e59fa5572b2c0d1052cc06121a439dbe0b8d439af0033dbc3c4d43b27adfc3f7b1e7edbe9eadc8bc60bbf8b60af05b121615e87deaedfc504ff5b51c56867d50b6d8e84b64b84f254cae5611c5e6e77c5ac5fede336a8d5d3244fbc2be6ed9c6bed7e7cb6528aa455b0957b5625c819a164cefd75383b5acd972a97d4b864c52671ca0f8058fe5b1dc5ad732a9335e0d77de9a17c1077a2d209492b3c60644483497a68273f35dd086c09fb2f627b7b920ea758d09419e8fdb5ce1d6eb78a010bf345777f2311d4492d26a"
        }
    ],
    "number_FSL": [
        {
            "id": 1,
            "title": "1",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F1.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/1.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=391b4e269a82e8ce018149fc1d476c1f268a2948b40d7d9dfdbbc85cbfaf9f17152e79da568f77b164629ce7ff45124c0bcc4276643527eb5998b10a7ec623fb8ae73a37c721a08d6f14332e9c8111b14aca1efc72d97464f4c2c62141f9403c3582e3345000d777357409ffd693f20d06d3c97c7b09f786244d4737af6ceb96d3328d2c53d6f350618a74ae03e2a57a5adb978b035320b8ee864484ccbd2088a0c5a87cfb4742a1d1da2b2b664ae6d16a77ba23135d3e3a7684572e0af60dae3a3b87b307b61705624ea620f9aba0361e1a0e6713468f8ceb9adf52660eff76ae5f5db0462a7b88339a064f50b03c6fb937f055e2c6efe70dbb14eece0372cc"
        },
        {
            "id": 2,
            "title": "10",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F10.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/10.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9a5db2ec22134877d660489c7b03048014f0ab8bf8ed130c60f01fac80644de27596be367c27c760c055c6be2e08af17a0e85500630b0f33fa9d9c462ba676f13962072b39844647d1876e1e36f745a4b17a7d91726f42a8608c33113b5408882838522a600c126ed62628bd77fba8171bde6e378c6383dd65538717f05c909ebef677fb3c79cce0862d0f21ee5907755787a5402b34c79d8d38475989004f07e0b3a8353446ddd87c5efe81e8e3b13f483054eb551d698ac41e328882e71f856d2fe22850984e91cdd92e69e7fd9468e0cf574144982907ba69f84bc6c3471ee0aecb8d725925f4400b4f59816812b17ec679e9256b801cabcba6872dde826a"
        },
        {
            "id": 3,
            "title": "2",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F2.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/2.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=55a2b4987e954c970e7d0515e39fbd4a7c9b7c0383c7b138927bd45840402e5a7d738251e300cc293722e96d6aa53bbdaff24e0f8b4bd9a7378c8317cf26558525700e3a7f1a090a7e064f97790a000306d75f9c76fd5500972456b1800a441b8d7bb4675732e32cae9478699f94150a13e12ffe6f1085ce660cfd9e398777063669e7bf6de4cf458af7b1f86246b70f719efa4ea30d33ef0c6f2689d0c9a28c969f2914e571f67d2b9a59e7a1c01d9b9d1be75f4c0c8133e870d350bbc20af8d608733a1e142acae0264dc19bf66274fb39da5d96da2e88992608b6f09fd854168b28c0ebfe411dc397fcd438add954589593ef998f466a664c4799233b8b2c"
        },
        {
            "id": 4,
            "title": "3",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F3.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/3.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2f18a8b618bcb4dccb57feb58a86fd00a9bcfaba951387d952c1604aa236e275e7fc32d49a85c458781c6d701e217a3cf2aa2bc5b055277cb5901716f3093cc29d84f3095fd4e1e2ccb09f153aeabfb1d9800714f81a0c1c4e6158771672a88d9969e3b39c2ecd15c8e2a2057bc9d20345239247f33bf84fbd196fa95f830179910b5fc3739a609f2d0cd7d8f9d755185f839711dad8bba25286f1d7f3b26807ccd70e01d1763ce85eda4bc16b4a7f35bb41f29c485340144e9890f355e0030e4b2b952e5e9ebff35cc39f40833f4b682f34fd63ee1fc58851662fd24fb8dc797cb41c18fdd8b7ea58095a555d0f8a97fa1552a31020090c56621fcb2a18b07c"
        },
        {
            "id": 5,
            "title": "4",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F4.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/4.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=615f3a5cbc6dce06dcccd6c68d9b756fd965cadaf9c591df0f140f31abbafdd487070a24f6556e94d697f001c13064d7d6d009f4f5538cf1da59f1ec3d6cbf20ddffd2c1a1921ec440ac728e4ad6ee4c46589c6d037289216a887dfefb4dc740c44d7d9aa636ca7df8e95c2c9535edd3259cdb70375f36df01e90c4c1ac13f7047e5513a89cb0d06960c66fd49ab03f9fd1b6eb1cc9b1a6c01bf08faf9e241d115718d05635b010798fcb30ef5274db5dc65f9f979b49bc38d03174ed01cecc119085206f2bafcd7ffcc88e9ca5769a051af3bfd3908efb2d7944c412f4feecea129ed373306697d6d2f155ebb0b6f58336e5700bcd7e8b58e4c9f7859c3bef5"
        },
        {
            "id": 6,
            "title": "5",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F5.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/5.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9b71a7b858c6b238a65dfc2cf582d0c8e992db0bdc1702f91b49b37b66eafc7178088a007c597179f55e89aa9f117976a4c3f2118d97be253d35da163930917409fc32a2931fa39b52175dd9f1615b89b30051882273af5724315b958f83230c5d853d8082582574e4dfd302cb2cf0fc6616cec19a8f26b2efec70e312e3b4d28f85f474d4444c689fcf58647a4c1e361cc319c562e92cb162aaaf8aa93c8f8ed5b35972787b8f860446e99c50fc488d175e424b943af291862f3cf50405fce0162f50ab31ae52639541c09ebcf2f7e570848f28e986a05345f1befd740a82fa78ac420970c3375ab9d1eb5431aa7b57da7875deb8276d161bf7a24388eb5f41"
        },
        {
            "id": 7,
            "title": "6",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F6.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/6.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1e22135a39543187b58c593ca404e8230546f7fb530b9951316b1b2d5084d9a51606f6eadfde6f953b7d0b7e02b3b1cf8b076906e479490c55150bd29e6fed9e23b8e672452755e78df2e694f122145a4a36427608f30cfbfbf3d64b31f70a20738e999757c89f5562b9a9fe71f94e64b8ad5edfafca54655ba37373179b609b133d886cef69f28163137432f11c039624e1ce61915ad99759a9c008a2650b56022b7643780d9f0934838c90503a12b55df69a8bfbf6d220e8f181bc93fe8e97d9c9b6fc608b4aee913e21b43098d85c5e25942169718ad9bf2d6c487c7d399f64a271a37c719eaa8ab0344551d91719e7edb4358b385f0ff1c9245520e7000a"
        },
        {
            "id": 8,
            "title": "7",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F7.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/7.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7fd1c998f14dec4fdf19b2536320c6081c467d0d21cd9409de935efa149bf30a112612ccdd3339a1d8c95937e1d33ce62b5013b0d6e35e86487abec8e786226931e00538f36f1cbda08e394d42e41c3378c46e49329bac10f2f4a6778bffee758827456be90a9368d7fb4ee37708eeb71905058673ee53e73fcf280a2b1ed3fe1d1fec453aba7ef909bcb330bdbfb9835d66770019b1997c24a119e4400ee75803fd598bc7dda4867eb81d3aeddf5d8a4b41031952e345b7d0c1a4eec7f590bb9dcecb219dd5cfbd68c72d251673791f51f8d90ef49776807f78882533c2614079a02b403c58f7bbcdc683131511b2c085afa1bdb7d23858fc2352fc43145064"
        },
        {
            "id": 9,
            "title": "8",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F8.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/8.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2f14aced01878d001ff4ed87770299f1ef81b23d341382cafbbbb0bf19eb062b5eaf5010d4ad0eff9bf90216c3a77b5930d9ae37c48d687c7e12896a71529cbe0689c8c8358e134b7121bccd0bed599cb0992bce6b9af58bfd0af1e63109de8f71eed9cee55e0ccbe4b4b5b2401028a41dfb65055c1a4861f0d4fe3a06874ec3a2cb521454525accb604a674cb4c1dd94cd7095646903ca711e895fb003b420f3c76c9ef1b5051b07d5a3edaa48888daf6bb9fdb3af97515572fe70d989717a4b0c7b7584cdf49639b530f23424ab95a06d6dd5328c09bbea85b533e9cd94d1c3be9ed98c9ec7e0c3298b41f8c40a047e80576df115a80bbb0af72362c4e5fbd"
        },
        {
            "id": 10,
            "title": "9",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F9.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/9.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=40fb68df7395e44b186f9f11abbbf829b37629f9ad0c75c6a0716a2d0841fff699d3481d3d0dff655c15f4d63b34e37a9ef48e75dd0783621cdc5ed667363a533b3e5ec0486b6247625b3da234a5a12981dc62e939a6a80f658e2a3f5bac8091bcb68d01def4fad9946314febe41f57afc6e23ae252c66fbe625cf2e6e23e665eaa0129affa133c1592c49b64d6ecddaf61c11dd7bae6317e1fde69b47a96ceba30dc3976815c3b360b11226007a50ae73ea8aa133916cd18d665911477894ceb7e32fcef65d21b43854d9c1699e9712f676343d5d6923f46ea27dae49bce739536b6645bc2ed5437f20aab24bc32a5b35ebf3e54bf7040e0d436f566cb19b23"
        },
        {
            "id": 11,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        }
    ],
    "output_videos": [],
    "relationships_FSL": [
        {
            "id": 1,
            "title": "Blind",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlind.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blind.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1f1b32c6a6cf0b74ca6927e86521e30e45d2f5eb0457d308c8ea56014d0bf401c5566f538038a5469ffd6f0b869276366ce54932f43c3623cde9d88bb34f7a8eebb05c2dc76756f74ff7f0079dcf5f6c431f7f3038d63d890ec168c20109219f9231940774beb3743727a76d3b3362f92024ba9a44d5bb16f5fb4b77e3c09561467a95b5f2c93dd212bec69a0de85b0b03a778d42958a25209bf83ddf61a2693762842a4f5c8bed460d522fdf98329a859bf03b3df591d3a88956f138da83018e86333efdca75e9b7e796ffb2afb1843e7767f5d015a46139c0b0212faf5b412e0570c6bfa5e585d8f5862c32ffb05fcc88a66cbda944dd8a2069f4a927fbbde"
        },
        {
            "id": 2,
            "title": "Boy",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBoy.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Boy.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=22986d5b17d5acd3377971f2c17b50e1b0d446d57927b2eace074bcaae0218f20143bbb0b9bb8d03c3d2198fc58d28fca42dba79928c8737252dd852714df7c1aff4a7f4f1c66e1b76dff3f624c1d20cfad4cb73c1698244e149cdb60ce882e0e5e030c7dff0c2e7392f57068315627f40d1d34b92a53dcd29900af89531607d8a5bd4abb7de80cefdd82cef9a866696ea7d542b2c604c38d689eda6679c8cc5a4f01bcc7e7d1ebc3d53884556c500707a09a48ecef4c91acf03cdeff4868edc8b1fe012be17e641d684e10d9d522e8580f33e409670b06757adb4dd187cd532d56aa4f16733b24f17afe7e9fba46c961dcbdd7fc24393c1717bf843e7fb190a"
        },
        {
            "id": 3,
            "title": "Deaf",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=63a1f55ce539fde92c7acf0be88690d4de8626c941434f2ade6c773fa249ea2936f4d62394326ea1c28c66982ed450316155a4e4a33707d9d3f63fc2bc3df2cdac37f2b8a96654171ab7594409f3aacc4aa63ae10917268cf18a233eff9e90ae6098d207ae4b8b58df67d96ce116543a71321a2f7c27b78105e51a1131333abfdc61c08b2dc279413014062110feb2152819b65a1d353f21bca6523fb2282e84ee127f3a580a4f459c414836f515f5fd65ac6cea4c4b764aa3a3fbb375e48449e71eccd1801a7ed5436804a5b3651471fe129294a5616dee22649b7c04630976025a18ef61bf7c10c20acccf130434fe86967d0c1755358e493c42c0ccd2bbb2"
        },
        {
            "id": 4,
            "title": "Deaf Blind",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf+Blind.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf%20Blind.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7511fe3c8642776f171875afb5f5555f2a370d74517a203105506c275207fbaa366c646130407c13975252c39993a71b2f615ea08bcd75af2aa01f6d2a591020b0c17b5008a21f467dc70029bf95a330fe0b6ff125baeb0140850db292f041175a4b0930b513a0af4e4028fc0694ac11d57b428d866e20920e3c42cc84734b02ff4847a17040d286357ea8744a58354563e6c41161694dab50397469b8961d75bd0e0f6cdbf5ae4e3309ede395b16f0fa73f9aa7a8c0cbf67dce650681265be6f1dca8c6eb8884b29b42c10147687bd6b6f3f2c243368fb4d33fb76da39e971377dd1bac45c1ca395b9190b9a62d5ca8efff2cc56a71f7a955a2a57e2a723087"
        },
        {
            "id": 5,
            "title": "Girl",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGirl.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Girl.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=24f66c9e811d0cb7dcc025d3150b3849d14d4e6d23df962a81465664ea36d89d5b0b6a722ad19f5fd2c08b618c41470e0101a4c0a60a576d2321440fc81cba4cc8d235db9a745c2c528df8ca584a75d82f7e8c48eb075326542b87b7769cb0dd461347076edb8fae54a35f8cfb6f6f453eff8dcd04f0a1b5552ffd6b7c14a7c6aa9d9d441ad747282324f25f8a3ec441bfa6d609f19aad443eaf20d5b08df7a4ca48fc0387ac3a76da4f09eb00bd1f3d16321f4037d8abc143c35ca5e5162a1e84628cb2afbf8af83143d3d6f4bab109acf016b17b92c3a045e166f60333be7a8c688cdb1ded063f0eac792a6094de12c4fcf5ab90a450c01f8cf73ea44b5679"
        },
        {
            "id": 6,
            "title": "Hard of Hearing",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHard+of+Hearing.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hard%20of%20Hearing.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3f39182514f654b1bc8ebd29aed0c2d14b98dd915d17b2c954fc625d3e3531748cb6ef6162111379e216e614d0207249c24f0fec939a891889433c114dbf7100c3b65f59b16174ebbc6fa3183c1720e9212a38b4d44c441539077c314b252dc3b7f1b00cc212c146fdbf16ff14b81b2e14748846a923462a59a6a73c6fed3f95747e2f887f8e0006630e2877e2ce15c94c73d69e9bf36f7b63ddc6e3a06d607db54559c79988b5f3d84bdeb15a96c8de44918f7c9b0e29c048e363119cf5d4f2ed5336331240fa71f03dc929c383902018edc48d19a54aabe98c0b15f9175d35402aa03d013754abacebd44e5bad201ca9e3f4aedcc861b41e91ddeb10019335"
        },
        {
            "id": 7,
            "title": "Married",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarried.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Married.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7cbc8d1bd7608c9ed9218798700f5b7f6ecf1a4966cab1ac290638eb18cf6a009a4b4e51d57f000c61e2c3fd174dae7bd7e234a35cfef4fda2cdfe7e9d225405e9a41b722f9bbb976986d969ea27faa14d52e3d5e8bb38397e8a8bf3fb2bc42b5738a82a1477aab59f25ab51b2c9a7d00e25f131075120b9e436d33d5b8336454d56dc59825d0de3e2295c4f5fe4b8741447f5364a4955407633968c9272aaa6de1a4beb52cf76c712f5415e4f1386eb80497cb266c1d604c910e822747c784f0aef88f49965d2414b2f60b9067e312dab9a44f182bfaddddd7e02ec121ee87d1ffbdd67c70a7b6be267e74404bab241700b75eb887b7d541d6f65802388c6e5"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 9,
            "title": "Woman",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWoman.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Woman.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2fca3ac4bba06ae383fa5ca288b47120f472a61eabebf921676628eea58364ada3bdad524944c284a9479aefceca8fed168f139da79ba393eb88899a262bbb52a953cdb7d28eb8619fe84ef90ee727288d5281882fffcfef03aafe1d0c5e0ac2fdab6cadbe1a9dbd9761f9d670c5c16660f9de63ab28e20dc48a00d25f26f01309d4200ea2a92625d86eff6a0c04a61bdff6a9a4a0fbae8ff55bd7da759a70fcfa7078d05b272c6b23bc92f50f287736ce4a191586c63ddf31b733774d637ffa8b2d0c3c615b86c6c8734b640bab71bf0c44c56875c1d9eea98559c2ce8412a864ce9079bfb8a1c3dcb26d10afc6de0d4e1e2812b86c780eedce061b9c3c6ab6"
        }
    ],
    "survival_FSL": [
        {
            "id": 1,
            "title": "Correct",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCorrect.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Correct.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2193b7605838b20595003602b566f4b427d7e9de015c724d0d596601cc336642ff3b8b4fefdd2ca9ee3a83bfde1e9c093d1c8e382e1f6c2fa9e6fffe819eb04070b1772d2857069985a50da3f70c97d2e0b875c0269064a91e53a35dc691f046a9c462934256717bd235cd2d14ddd518797a28a9a3d5043b213cd7f3ef9deee7cf01d2fa62a705fbfa16b3677543fdb12b59679872acae56c74763c4dcee42cbfc5756bc4b03b7bdd3f8c77a797f48c4bc2e9dea50eadc03dadfbdeed57d97eb92c1df7be88c43d3b16dd7c46ce3d904595ad64d58d23d3ac8b5a0d32b9830658be68bd5cc5a08ceb1c2f066afdc9d6adfcc0a26addd9f8ff9ffd6ddad027d01"
        },
        {
            "id": 2,
            "title": "Don_t know",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+know.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20know.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=367a82c0942baa05d6b0bcffbe751381854725423916f02e9e8b03e358a8cc0ce530ec22426c418407d206d4d21d8563e057ac6ff1ff6d16714eb5656d524753e6d00651fd3e1e3802942b4ef5dc2c3369d59cd4ea2a4dc3b9901c2329c2cc82579277a719ddee1e1fa118884c4c54ba59e0b1c3f8d0c97559d38b2699d3ba53b8869e2306292b9a962d682fe750183b09934e3b4bee621735de79d3713ebbd28e66df720daff2cac3f6d7c9a169b07a2648b5d5b731392b1679efe25fafdafcfb8d9ec99b6893cff65db9613cf0ae4cfa2b3b78682066adaa15081a84512aff0214eafc1424a3f14543af5b25756702a96a03a830810064166f9b64eda8e6c3"
        },
        {
            "id": 3,
            "title": "Don_t understand",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+understand.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20understand.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=91dad6bfb5a47bb85117b5cbb32529b8f37033dc46488ed1e8168e49d49ec9932203e0afa8509f6c4c10410b67a79669971f0a28ca2bba6613e0a46bd85897297e3eb9c233491914593949f53da95e7490a35a69e92842cbc0ca6f0a974917b11b45646c6d1b7d1b1d58c95e79523b54726f71b6769e893756ac035e4bc418254d4490b4ae302ef10594a105e5787a6d54cca1a8452a5c4f92125d9c9907f7dafa1ef48e60bd5333eabc377272f36b1b638bfa56abc0b88a1176cbe8f5357d3e33d6fa34e3c609427f9f29e17ead0d816d9aa327c92735e14da14589a00066f21aea0ba430566711ebb68dbb417ab4d191a93482388c69ceef5c04de6bd1fc04"
        },
        {
            "id": 4,
            "title": "Fast",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFast.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fast.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=24ba8ee6093b445e8c452542288fafd4439e78db7bd8820b0e7f029bd670f962dacba8cf8897837b2f1c601008426a1e8ae6bae0a1cd702cfd180d57da4fc71ec0f183f5cc5ee5e62684ad8f094c99cd38bf2e9ca4499c362e4ad1e8c1d6b4f5205d7bcb903a952e7014abdf2e7c601b0383f93e76cd4947e4d234086c07040bbb1f6005ef002abfe11b0cd801c9b45908daa0925cc149405c1ecf2e5e7b76e40261ecefb766090869b4ee433137918ab2bcbd91e0e2989723dbe053af78b05bb74265f98fec20a7f4ca6cf30aa509248eb2596f47067121d86b68b3a566de1da68cb713049597aa1afaa781d5cb2b03d9c86ba987fa7de41f511960b0c8aa6f"
        },
        {
            "id": 5,
            "title": "No",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=14a6517c4716dd7d5e07acad7556469edf02b4c216f9d52b31bb63a21a63706ab10aa2fce5217c3d6d771b5fa1ab452cb22ed0fb1944f1c6e7b345e14c75d0e180f6d3f62a5f31d26adf5074db922d1217da53d50feac1b8665f217add2ecb252841b4ae5cad4d6f990bdd01bc96095335d52c3006b7dbc7fedc45caa608050cd82feb8fbcbb42fc3765041263d8c9c50ba5da03b9c6bcf0d7382549a814e51274f90b79ea377d05f05630ab12ca71fb9433c8ea7f636098ae07a5e65a94ee6ae174cf326a5e461cf61c17322c8430db272c57f88cf9e3269f35a109c530b0dcb8909db8b2387b00bfed120658bca63b8ad6e5440eab790821be5c598b092947"
        },
        {
            "id": 6,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46f0c40bb6c39469e8b30f65277e2bba466eb87491c1ad8e18a19859e408194ca72d103741d1c06342b5d613e2682cbcaeb901369ba24d0ed85bd2c6d58766d1b5133bf5aaffd02df1c3622eb7ba1f38b032f08d7be7e3db24da4ab18669ce361e9f72f2365462899640ed9e5d914e5adc7f4d9c27812ac8e8b968aa963a7cd2407efd29bcc7308cae679023585e3bffd3d5d50c30d2415860684282f58d9b74ce946dbe47e5766f695e9151ed04d2f65b66fa0d0a1d54e7204f6e84aed0fac41b66528ae8aa19f20d8776709c87969e7dd877eadadc56f14612201ed3e532f4fad834ff2a213867d6231490390e7bf4a2b5adeeda18f2c5447415b7698d123e"
        },
        {
            "id": 7,
            "title": "Slow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSlow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Slow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2cf064ef39182fd7b22c3e730d2ce3944212f0b1f09c46ac5a98139bcba7e93c7ccfd12cf5488a33453ebaf65f7026b74eca520bc37ed5ae4722a68f56f0f7437aa113c4b0e0679f08785b6c512c599a36ac76a4c442e9c6ef37bc4c3faeb1ac78b0eaaf73b398103f1a3ed427f77a23b738a44cba82c053842168e683d63cd8ab31ca68a486a0b8d327a7599b6ea26e8e382a9674a4adc27357266ab9baf0be0cbd9470a3fa98e69f6394c45ea620825346222fccd2ba536b2521ed91e886e72a780b13903f3dc6faa86611a87ff3ca8fcbaec0c86c64101c9206743efde9618b6f5cb947a3be1b5684d86422cbf3778fdd3eb612188aec228425a31166beb1"
        },
        {
            "id": 8,
            "title": "Understand",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUnderstand.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Understand.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=955a7a49a4f474f5f081b3bd0e85f8e15eb482c9f564e9eb3b0266516416bb2b841486e9affd0b9b2585bf7749156114acbd35ff23fd139ba5684c8a9276c73631910071b27583821295211f7e4dafd424d8e2372d60a2635b572177f4f1d31dc4507f3ab403f368df6530ec95d15d06759ef9b6c60034806bb90040cb1bfb797ba274c5405e914b1796913d50e21f8303f86bff81a22e7177cb300e7d7c85949cdac07ff027814561e25a867df058857702b15c4c84122e8296ba258d233afb0165c97a8baa1447c72b97168557f17f73f9922c8bf0a651aaca345233dbdfed1a9b54b15e773151485be3ffe03120b01942be79461142bf7a3e430f18b5cef2"
        },
        {
            "id": 9,
            "title": "Wrong",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWrong.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wrong.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=56b8bf531c0e6497d2f0cc58e7e1996fb03a6bd51e08b1b0257fc13a74630b76cfa15749d5f2c963369f4635d81c6e8a127673e9cba24b348e9071d984f0669c13f8ac246bdb0030fe9ac111240a946863e01e2ba330ecdbe4243eceacd39f8b884644ef4d2f3a9dd1703579c5f9057d67d4a3347f062eaee6de6bf2c3285dc8521c7ea990915ec8b588fcf65b4c6ce0ee9c92d505a6e73f2126532b5a38b9373925fe3eb3b44596a94e7c9c434a4e44f0facb662e634198362afc466e8dcac55f168ac7105f845a4b017523caee72e16bf8f245d4788f9bcefd118090b7bee5b1d738be87e9b935299a513b14654d98de309f3eb980b000b54fe0ac5d730e6e"
        },
        {
            "id": 10,
            "title": "Yes",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYes.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yes.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T135940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=60eb740aa8c87d11ac3863073af82d65b43a623dc73a6e5a7989b0ff82fbd1a2ce71bed7fc734fcb8784c21f3f41689f0c9e632ef5d53df19991accb31d0eba53568ff3dba7577178915bfdb7a78591be8d8cfa792b159d9d88e1defe552f8df55f9f6f66d1ed60d3969965ad1f7047d90350e211952f7235141ee139e798ecb1a288781d44e3f6f2eeb0e63000f4a99c9fa8db5fe8fcfd5d342ca5ff3d6264a502d55bad87dd2b996afaffee645328c629918347f3f87fe0b24890f9d1bf9a45ade59beb6994636f0c1d7e1691327ddea8c9ee83d72e10533c7612aad896560ab999e87b2501e3c2772d9234c1d431b271a0649535f16030aea0a9b71ad96d7"
        }
    ]
}



async function getTitlesAndUrls() {
    const results = [];

    for (const category in subCategories) {
        for (const item of subCategories[category]) {
            const { title, videoUrl } = item;

            try {
                // Construct the file path based on videoUrl
                const filePath = `FSL_Videos/${title}.mp4`;

                const fileRef = ref(storage, filePath); // Reference to the file in Firebase Storage


                const downloadUrl = await getDownloadURL(fileRef); // Get the download URL
                results.push({ title, downloadUrl });
            } catch (error) {

                try {
                    const filePath = `FSL_Videos/${title}.MOV`;
                    const fileRef = ref(storage, filePath); // Reference to the file in Firebase Storage
                    const downloadUrl = await getDownloadURL(fileRef); // Get the download URL
                    results.push({ title, downloadUrl });
                } catch (error) {
                    results.push({ title, downloadUrl: '' });
                }

            }



        }
    }



    return results;
}



const CategoryComponent = ({ urlLinks }) => {


    console.log({ urlLinks })
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);




    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedCategory(null); // Reset selected category when searching
    };

    const matchSearchQuery = (text) => {
        if (!searchQuery.trim()) return true; // Return all if no search query
        return text?.toLowerCase().includes(searchQuery.toLowerCase()); // Match text
    };

    // Function to sort subcategories and categories alphabetically and prioritize exact matches
    // Function to sort subcategories and categories alphabetically and prioritize exact matches
    const sortMatches = (items) => {
        return items.sort((a, b) => {
            const aTitle = a.title || a.name || ''; // Ensure we have a fallback in case 'title' or 'name' is undefined
            const bTitle = b.title || b.name || ''; // Ensure we have a fallback in case 'title' or 'name' is undefined

            const isExactMatchA = aTitle.toLowerCase() === searchQuery.toLowerCase();
            const isExactMatchB = bTitle.toLowerCase() === searchQuery.toLowerCase();

            if (isExactMatchA && !isExactMatchB) return -1; // Place exact match at the top
            if (!isExactMatchA && isExactMatchB) return 1;

            // Use localeCompare safely with fallback
            return aTitle?.localeCompare(bTitle); // Sort alphabetically
        });
    };

    // Filter categories based on the search query
    const filteredCategories = categories.filter((category) =>
        matchSearchQuery(category.name)
    );

    // Sort categories and subcategories
    const sortedFilteredCategories = sortMatches(filteredCategories);

    // Flatten subcategories and filter based on the search query
    // Filter subcategories with a check for undefined categories
    const filteredSubCategories = selectedCategory
        ? subCategories[selectedCategory]?.filter((subCategory) =>
            matchSearchQuery(subCategory.title)
        ) || [] // Provide an empty array if subCategories[selectedCategory] is undefined
        : Object.entries(subCategories)
            .flatMap(([category, subs]) =>
                (subs || []) // Provide fallback if subs is undefined
                    .filter((subCategory) => matchSearchQuery(subCategory.title))
                    .map((subCategory) => ({ ...subCategory, parentCategory: category }))
            );

    // Sort subcategories to display exact matches first
    const sortedFilteredSubCategories = sortMatches(filteredSubCategories);


    return (
        <div className="space-y-4 p-3">
            {/* Welcome Text */}
            <h1 className="text-2xl font-bold">Welcome to SignSwifts</h1>
            {/* <div>
                {JSON.stringify({ urlLinks })}
            </div> */}

            {/* Search Input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search categories or subcategories..."
                className="w-full p-3 border rounded-lg text-sm"
            />

            {/* Category Selection */}
            {!selectedCategory && (
                <div className="space-y-4">
                    {/* Sorted Filtered Categories */}
                    <div className="grid grid-cols-2 gap-6">
                        {sortedFilteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="p-4 m-2 rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-orange-70"
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                <div className="flex items-center space-x-3">
                                    <FontAwesomeIcon
                                        icon={category.icon}
                                        size="1x"
                                        color={category.borderLeftColor}
                                    />
                                    <h3 className="text-sm font-bold first-letter:uppercase">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sorted Filtered Subcategories when no category is selected and search is not empty */}
                    {searchQuery && sortedFilteredSubCategories.length > 0 && (
                        <div className="space-y-6">
                            {sortedFilteredSubCategories.map((subCategory) => {
                                let downloadURL = subCategory.videoUrl || urlLinks.find((item) => {
                                    return item.title === subCategory.title

                                })
                                return <div
                                    key={subCategory.id}
                                    className="p-4 rounded-lg shadow bg-gray-50"
                                >
                                    <h4 className="text-sm font-semibold mb-2">
                                        {subCategory.title}
                                    </h4>
                                    {!!downloadURL ? (
                                        <div>
                                            <video controls className="w-full">
                                                <source src={downloadURL} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ) : (
                                        <p className="text-xs">No video available</p>
                                    )}
                                </div>
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Display Subcategories when a category is selected */}
            {selectedCategory && (
                <div className="space-y-4">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs font-bold text-blue-600"
                    >
                        Back to Categories
                    </button>

                    {/* Sorted Filtered Subcategories for the selected category */}
                    <div className="space-y-6">
                        {sortedFilteredSubCategories.length > 0 ? (
                            sortedFilteredSubCategories.map((subCategory) => {
                                let downloadURL = subCategory.videoUrl || urlLinks.find((item) => {
                                    return item.title === subCategory.title

                                })
                                return <div
                                    key={subCategory.id}
                                    className="p-4 rounded-lg shadow bg-gray-50"
                                >
                                    <h4 className="text-sm font-semibold">
                                        {subCategory.title}
                                    </h4>
                                    {!!downloadURL ? (
                                        <div>
                                            <video controls className="w-full">
                                                <source src={downloadURL} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ) : (
                                        <p className="text-xs">No video available</p>
                                    )}
                                </div>
                            })
                        ) : (
                            <p>No matching subcategories found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
const TabMenu = ({
    activeTab,
    setActiveTab,
    webcamRef,
    canvasRef,
    enableCam,
    webcamRunning,
    gestureOutput,
    progress
}) => {
    const tabs = [
        { id: "camera", label: "Camera", icon: <FaCamera /> },
        { id: "practice", label: "Tutorials", icon: <FaInfoCircle /> },
        // { id: "history", label: "History", icon: <FaHistory /> },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-r from-orange-100 to-orange-100">
            <div className="flex justify-around bg-gradient-to-r from-orange-100 to-orange-200 text-white py-3 rounded-t-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === tab.id
                            ? "text-orange-700 border-b-2 border-orange-400"
                            : "text-gray-400 hover:text-blue-400"
                            }`}
                    >
                        <span className="text-xl">{tab.icon}</span>
                        <span className="text-sm">{tab.label}</span>
                    </button>
                ))}
            </div>

        </div>
    );
};


const Detect = () => {

    const canvasRef = useRef(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [gestureOutput, setGestureOutput] = useState("");
    const [gestureRecognizer, setGestureRecognizer] = useState(null);
    const [runningMode, setRunningMode] = useState("IMAGE");
    const [progress, setProgress] = useState(0);


    const [facingMode, setFacingMode] = useState("user"); // Start with the front-facing camera
    const webcamRef = useRef(null);

    const toggleCamera = () => {
        setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
    };

    const requestRef = useRef();

    const [detectedData, setDetectedData] = useState([]);
    const [urlLinks, setURLinks] = useState([]);

    const [resultList, setResultList] = useState([]);

    const user = useSelector((state) => state.auth?.user);

    const accessToken = 'ya29.a0AeDClZAL-1fYFx9EruhQfYBEnEqwXAV8MrLCAsZ3-1T…wIaCgYKAa8SARMSFQHGX2MiX84f8rwR8o3PRiXj9vOo5g0170';
    // || useSelector((state) => state.auth);

    console.log({ accessToken })

    const dispatch = useDispatch();

    const [currentImage, setCurrentImage] = useState(null);
    const [activeTab, setActiveTab] = useState("camera");


    useEffect(() => {
        let intervalId;
        if (webcamRunning) {
            intervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * SignImageData.length);
                const randomImage = SignImageData[randomIndex];
                setCurrentImage(randomImage);
            }, 5000);
        }
        return () => clearInterval(intervalId);
    }, [webcamRunning]);

    if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "production"
    ) {
        console.log = function () { };
    }

    const predictWebcam = useCallback(() => {
        if (runningMode === "IMAGE") {
            setRunningMode("VIDEO");
            gestureRecognizer.setOptions({ runningMode: "VIDEO" });
        }

        let nowInMs = Date.now();
        const results = gestureRecognizer.recognizeForVideo(
            webcamRef.current.video,
            nowInMs
        );

        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Draw the results on the canvas, if any.
        if (results.landmarks) {
            console.log("dex")
            for (const landmarks of results.landmarks) {
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                    color: "#00FF00",
                    lineWidth: 5,
                });

                drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
            }
        }

        console.log(results.gestures)
        if (results.gestures.length > 0) {

            console.log({ dex: results.gestures });
            setDetectedData((prevData) => [
                ...prevData,
                {
                    SignDetected: results.gestures[0][0].categoryName,
                },
            ]);


            const categoryList = results.gestures[0].map(item => ({
                name: item.categoryName,
                percent: Math.round(parseFloat(item.score) * 100)
            }));
            setResultList(categoryList);
            setGestureOutput(categoryList);
            setProgress(Math.round(parseFloat(results.gestures[0][0].score) * 100));
        } else {
            setGestureOutput("");
            setProgress("");
            setResultList([]);
        }

        if (webcamRunning === true) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    }, [webcamRunning, runningMode, gestureRecognizer, setGestureOutput]);

    const animate = useCallback(() => {
        requestRef.current = requestAnimationFrame(animate);
        predictWebcam();
    }, [predictWebcam]);

    const enableCam = useCallback(() => {
        if (!gestureRecognizer) {
            alert("Please wait for gestureRecognizer to load");
            return;
        }

        if (webcamRunning === true) {
            setWebcamRunning(false);
            cancelAnimationFrame(requestRef.current);
            setCurrentImage(null);

            const endTime = new Date();

            const timeElapsed = (
                (endTime.getTime() - startTime.getTime()) /
                1000
            ).toFixed(2);

            // Remove empty values
            const nonEmptyData = detectedData.filter(
                (data) => data.SignDetected !== "" && data.DetectedScore !== ""
            );

            //to filter continous same signs in an array
            const resultArray = [];
            let current = nonEmptyData[0];

            for (let i = 1; i < nonEmptyData.length; i++) {
                if (nonEmptyData[i].SignDetected !== current.SignDetected) {
                    resultArray.push(current);
                    current = nonEmptyData[i];
                }
            }

            resultArray.push(current);

            //calculate count for each repeated sign
            const countMap = new Map();

            for (const item of resultArray) {
                const count = countMap.get(item.SignDetected) || 0;
                countMap.set(item.SignDetected, count + 1);
            }

            const sortedArray = Array.from(countMap.entries()).sort(
                (a, b) => b[1] - a[1]
            );

            const outputArray = sortedArray
                .slice(0, 5)
                .map(([sign, count]) => ({ SignDetected: sign, count }));

            // object to send to action creator
            // const data = {
            //     signsPerformed: outputArray,
            //     id: uuidv4(),
            //     username: user?.name,
            //     userId: user?.userId,
            //     createdAt: String(endTime),
            //     secondsSpent: Number(timeElapsed),
            // };

            // dispatch(addSignData(data));
            setDetectedData([]);
        } else {
            setWebcamRunning(true);
            startTime = new Date();
            requestRef.current = requestAnimationFrame(animate);
        }
    }, [
        webcamRunning,
        gestureRecognizer,
        animate,
        detectedData,
        user?.name,
        user?.userId,
        dispatch,
    ]);

    useEffect(() => {
        async function loadGestureRecognizer() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            const recognizer = await GestureRecognizer.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        'https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/gesture_recognizer%20(4).task?alt=media&token=be782707-bb23-4d99-9c94-a8bc65b99adc'
                },
                numHands: 2,
                runningMode: runningMode,
            });
            setGestureRecognizer(recognizer);
        }

        // getTitlesAndUrls()
        //     .then((data) => {
        //         setURLinks(data)
        //     })

        loadGestureRecognizer();

    }, [runningMode]);



    console.log({ facingMode })

    return (
        gestureRecognizer ? <>

            <div className="flex flex-col h-screen ">
                {/* Navbar */}
                {/* Uncomment the line below if the Navbar is fixed */}
                {/* <Navbar /> */}

                {/* Camera Section */}

                <div className={`flex-grow w-full flex items-center justify-center pt-16 ${activeTab === "camera" ? 'bg-gray-100' : 'bg-white'}`}>{/* Added pt-16 to offset navbar height */}

                    {/* Display webcam */}
                    {activeTab === "camera" && (
                        <div className="relative flex flex-col items-center w-full h-full">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                videoConstraints={{ facingMode }}
                                className="w-full h-full object-cover"
                            />
                            <canvas
                                ref={canvasRef}
                                className="signlang_canvas w-full h-full absolute top-0 left-0"
                            />

                            {resultList.length > 0 && <div className="mt-4 font-bold absolute bg-gray-700 bg-opacity-50 rounded-lg border border-gray-300 shadow-md">
                                <div className="grid grid-cols-3 gap-2 text-sm font-medium border-b pb-2 bg-gray-700 text-white rounded-t-lg p-4">
                                    <span>Label</span>
                                    <span>Percent</span>
                                </div>
                                <div className="space-y-2 p-2 text-center">
                                    {resultList.map((item, index) => (
                                        item.name && item.percent ? (
                                            <div
                                                key={index}
                                                className="text-center grid grid-cols-3 gap-2 text-sm text-gray-200"
                                            >
                                                <span>{item.name}</span>
                                                <span>{item.percent}%</span>
                                            </div>
                                        ) : <div className="text-center text-white">No result.</div>
                                    ))}
                                </div>
                            </div>
                            }

                            <button
                                className="border-2 border-gray-400 text-white rounded-full font-bold w-14 h-14 absolute 
        top-1/2 right-5 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-500 flex items-center justify-center shadow-lg"
                                onClick={toggleCamera}
                            >
                                <FaSyncAlt className="text-lg" /> {/* Switch icon */}
                            </button>

                            {/* Play/Pause Button */}
                            <button
                                className="border-2 border-gray-400 text-white rounded-full font-bold w-14 h-14 absolute 
        top-[60%] right-5 transform -translate-y-1/2  bg-gray-700 hover:bg-gray-500 flex items-center justify-center shadow-lg"
                                onClick={enableCam}
                            >
                                {webcamRunning ? (
                                    <FaPause className="text-xl" /> // Pause icon
                                ) : (
                                    <FaPlay className="text-xl" /> // Play icon
                                )}
                            </button>


                        </div>
                    )}

                    {/* Practice and History Tabs */}
                    {activeTab === "practice" && <CategoryComponent
                        urlLinks={urlLinks} />}
                    {activeTab === "history" && <p className="text-white">History Data</p>}
                </div>

                {/* Tab Menu */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-100 text-white py-3 shadow-md">
                    <TabMenu
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        webcamRef={webcamRef}
                        canvasRef={canvasRef}
                        enableCam={enableCam}
                        webcamRunning={webcamRunning}
                        gestureOutput={gestureOutput}
                        progress={progress}
                    />
                </div>
            </div>


        </> : <div className="flex flex-col justify-center items-center min-h-screen space-y-4 text-center">
            <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700">Please hold on while we load the application.</p>
        </div>



    );
};

export default Detect;
