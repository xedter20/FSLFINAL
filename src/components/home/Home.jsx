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
        "name": "calendar",
        "bgColor": "#98C1D9"
    },
    {
        "id": 2,
        "name": "color",
        "bgColor": "#98C1D9"
    },
    {
        "id": 3,
        "name": "days",
        "bgColor": "#98C1D9"
    },
    {
        "id": 4,
        "name": "drink",
        "bgColor": "#98C1D9"
    },
    {
        "id": 5,
        "name": "family",
        "bgColor": "#98C1D9"
    },
    {
        "id": 6,
        "name": "food",
        "bgColor": "#98C1D9"
    },
    {
        "id": 7,
        "name": "greetings",
        "bgColor": "#98C1D9"
    },
    {
        "id": 8,
        "name": "number",
        "bgColor": "#98C1D9"
    },
    {
        "id": 9,
        "name": "output_videos",
        "bgColor": "#98C1D9"
    },
    {
        "id": 10,
        "name": "relationships",
        "bgColor": "#98C1D9"
    },
    {
        "id": 11,
        "name": "survival",
        "bgColor": "#98C1D9"
    }
];


const subCategories = {
    "calendar": [
        {
            "id": 1,
            "title": "April",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FApril.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/April.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=970a0a756e2d6b7b847bfeb36252602da3bca350f830a8e45878b02bde6068f77086685b0eef8f13758ca123ce93944766c23df7535357ad355778d3b2296539eeafe770b65fe7c198978efef7d639077c2595cf3cbeea0948fcfcfc7179d6e76962944837e6621c6714422e2efd2d1d7f5bc7e30eb530049a750544ec850d31dee05ab9b28ba8885789b2a97400ccf68378f73e98bc274d3f7f580839165ff9526784ea5ce9a948f769c123ead99c99b4feeb3463398803e1504b0337976b07db12114aa123b6c72cc32dd1c92937e9e55945aa81158ff6be85745a3c9a009c5f239461be0e9f86c565ce64f52be9e87c4d821ba2dc4dba35cfa85b246ab8b5"
        },
        {
            "id": 2,
            "title": "August",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAugust.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/August.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1decfedb860224aa9a99f554d98268b7dab5b36dd22172961c0e066024a8f83ddab7c63b847c9c93295cc135572c3cf02630aeb303f17e5a2b36a758843cbd045179dacdd36d807f90cff438cabbcd739f1209f5725fae9523073f633baa2cb99c47735add114d4b343dc46cb6be2722df2bb51aeeb739af7dc4f662754cc333aed9afe2af2524a0def99c4c15b9fd1b0226e2c728fc9111f222511002239ae50512f07b44bec378716b05f6da2dc15c786bbe2c0aa786dbc46677df6909b9e0c606bbf1a07e70a92727aab1206faffa37aba4d35b5bbc8813cdf2fd855e9787de85d92c5bf5d30d6ef9ebb7392df80b8a7d02b85da37061d46bef6d9838ba92"
        },
        {
            "id": 3,
            "title": "December",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDecember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/December.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=18923425030dc41f1d0efd74054a75ac1b269b6ddfa06c3abf5f741faae42151235470a54d8cca11b85b0a6f92efe68108ca7f0a2ae4762f8de9b198dcebd569e9416f3997c3769ee74d20f0f1e1482b22c75ca9500f48ba4bbb77d44e3386f7a7f9c34c7c498a3882cab869f455eba7cb2b901c01c6836acc24d975dc945d79d0e392cb84dc6f24e5b39b0d2f49f1887cf4ef837060e313cc15ce3e01dbfc461d8fc8461b7d7d3c8cd0550a55df09d5cebedcc743a8ae47436804ea3dfc5c2b22ce59f6e08097acd563ef3788dbdb0d24a9c01a08a4d28807a78031970048517230517b11bbcfb4f03adef4ab6bf2bc7abd6fb09098881fcf7bc8f04a9ce39b"
        },
        {
            "id": 4,
            "title": "February",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFebruary.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/February.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=429d7b637b13ad802071b086036240f7ccfdfe2e73b0fc952ec5960ae9bda763e362ce500f4b2134f6702790e48c41842a4879fd9bcec565cedae2119f3837099d5f0a15b93b47712a4b81c398fe943254dc727a87e72d880023c523824f30c55b7e63683588c99e3a1f245844ac556414b32ebbde43ca5ffbaec5149b1870f0ce953a8bc08450606a1aca8e1b2a6d5ec36bcdf61fadf8334433ff5a3083bb371a427199e1647ef86f3e3258048c260e7f0219fa3aadbac26c3f922ec7dacca67e5c6928d72f42e695d9514c65ed6f48ddb851f8b5343b96148b1e0d05ae95b5436828606ab4327c285da2c1d129d7e0bd23e29a49af293e2932624b934e83ed"
        },
        {
            "id": 5,
            "title": "January",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJanuary.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/January.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=69f8e55a502321f7f55c4b543bb247bdfa8f2c9ece50a00a79d2b616ca81073ec81806e84d76bdfca3bc1477218085f006727dd1c90a45f1d1b9b3e3046f4b8425ba7b1a4a370403baaec65d37aa4a347b447f619dd5b8db5686e36b3c5d49efaf142b9a8b44b56e80fdb09f716d614d15763bcca2587dcdb969982dca1dd62201af9d86054ef52a73cd77f5839dab5c398e13bc7d17d50b2725d0466d7d2a3c1226eda2fd378d924b7312b7b78da6e34c8b02af640421a5ed0cf0436e124f557942d627843abd42c8f24838bf7a940eadfaa72124e6054bb442562ac793504b561111876c7ae862a4d7aa3dceeafb44d499c7dbc7774d46c1a78fb016b5b573"
        },
        {
            "id": 6,
            "title": "July",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuly.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/July.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=46e5b81c851b8a91b9a192a8f3c97e1ae7f5cd344f2a67ebecefdbc5b3e6a297e9dd4ac38512ee4f245c14afc67bffe71a02e09c84460047a6afc6b3f52855a308ddebc57fa594dc2b02dccd1a46259248c2b3a64d5c6194eec0817030c09ca9eb5d07a16d0303a6c6546502110ce9c23d012a6e71e6f44f4ce26199d92b841d610dfd8aec9cf64ecfd9ed75e39876bd5c6ec3a02217938dd134f6484e7f1fd8e21849aceb755c46f4b81854ab23a0e34a8e8da855a872b33ab1d1c0250a835a891561acb7ea29f502cced41fdca23ad0bf32c425c0fedfdbe715c262fafdb3247f36e34a1dee865853e4bc7f9d96ad72f3cf814a0fdbfcd5fe50e5981bfb630"
        },
        {
            "id": 7,
            "title": "June",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJune.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/June.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2b656ed45cebd514b9d68f0df101a3118311cfdb15b9d178bd3b709e2315c0af03be0e8636192489e405ff87158e46309f0d0f92af83066620a57589ef5a62975ac1f9616266654a9e46c220b81092507cfe2690834e35f9aedb141710ef474686fcdb21866e4dfb01a11648ec662cc1cc723955a3ec3938d673d86e81410fe7d24faed12b6d7e939326b8d3b586547be420eb5cf6ee9cd1fb794136c067fb145ba8594f2bf4cbd204e8fe855ffa84d6f747a6384b221fe24404a8da409f12375c95e8dcc87ab7e9cd308964e8cb4f667cc686d3cf2cf870855b1c5d86d848e2915819b6a757bda24876f8afbe58790667b12072ae3aed33abd6a3c021c12532"
        },
        {
            "id": 8,
            "title": "March",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarch.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/March.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5e50586e5776aa148d95bf0d212598f8ab94561cf19b63afce64a6fb3b5d89f05cea4faa247f7cdd539187d8538b2cd5358a39bf50da781362d20b9fc2541252db937b7075e7524eb2ab09fe103d1d88a63afd0f4466c9c65b533fc717823b7edf21add822dfebac0e64e1d62824fff82e3bd9206b6b379df760f8fef500df0365783ae64ac40fc5135f42cf2a368128a285e8ee754c72001c8c3a2100bc5c700fec0521325fad755eca322978e18a5c7ca574bb2cb026474c89c081a127fac8c8705143b3fb7bc0405a8b89005a8f1487884fc954f16e4a66f573a08200f60a4f363a7836c35870b08bcbb72a08b06276996fdecba840301bcc2083bfe092cc"
        },
        {
            "id": 9,
            "title": "May",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMay.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/May.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8b77236c18c804abbfb8ebd6d3c16e6a210d86b2e55eb4ed06ef4c68d21c562fff8aba5a184d9ea955935e2e4592bd42777abf8b1a951737c6d288fd04bfca473b4a3461e79d0e6344cc7fe4785edc5443d1995274bff4fa5b9eea9b819c8937b0da02437e925353e03bdd18709079aaaff66e24f8197aa9198095816859815d1e97222a509ec829920028f59f2809dce8e5b03f630ee982d813ced8164b8dcde07f8910286f155405774d8bba54b5f1d12d2e8c55b834e427daf1c39bec0df576f216888e36b7fe0243cbd6fc158cad9104943a1838a878855480d0e4fe0d84ee42601fa86ee4ce3da77a8ae20caa8a3b8db7ad22e5c04acb72b3928c35c69b"
        },
        {
            "id": 10,
            "title": "November",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNovember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/November.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4f21c2c2ae263f8de6ebd17a1ba2173af8f910721ede5860580a2416ecca58c8c1e0195045ea8e9a38526322a72982396aff9ac67f85ed5c4b4f41e34c337d8b25113ed1b91b9105cdf36b7a396b58ec8da36de14e2b4ff6112196c99fea23325fde99a6b4fe48c443443993f38374d6d769918ff233dee4e27f2ca3a2da71426bd4c514653e63f2c43f7302dbd5ba4eb250f820cf40996392a91ff9cda25adb2cf46590c77ea098a489154647d3d2ecad73ac6fd465a2efedbb3abba994dff8749cdf90df716cd57b897519cb1ac69b7b899cef96f907ee8a7c9826fb542d825b7fd4eb02e45be08c7afe7eddf97b64c47cf11879ad010a3790d2ff9a764d74"
        },
        {
            "id": 11,
            "title": "October",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOctober.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/October.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1bbece72c39366607c82300bbd43c8d3f99fda124b7b017d7441c9d437c1b5e7c74ad371ad4195de0b4a09323d725ff6032ca4f129e90d124daa4b61698692f5e6cb968b469103b374a7e70752f38f4ffd54f9a12c3cc3ed10869ab02d09001a6b9d95a36d749c2bebb521263ac20fd1e695c8d224b1c63c6429f34b6c0d1e1d9fd1674fcce7a259c5e718b4bdb176371523b432030671b016ee07d4216dd4d8d43a12ab241c62bbe343a8703ca4e73737887ccd65d842dc6d7e29d1078a341e798066f317159bf424feff299010528824ebf0c3b4f07a3721d8d7b18ffdd7acceaa5eddf5aa432030d9751c718b81e1ae8f6fb0d364e47ed0739ce8a7f4aff9"
        },
        {
            "id": 12,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 13,
            "title": "September",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSeptember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/September.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=25cfd2126abb298828491b6ee9942494a53197dae9ea30592a6b3fff6309961e7cbe2878ed13dce1e77ccafc2daf79e08162828b4c0097a52d5d809dd75c9048208fb28f6f3cb37d9679f3910895f7164fe830c3a25904e0594a409a43ffa058b3a05581859adbc5dbdf0cf68a2467efadabefd64239443493fc58205e70de51581284530197dc5eba4be4f4b838f37f40564f86f2623c8cc08ee4c149b15abe0c05ca357f1c793304cd04af10adfe0e434d0614845b3e5c893e953aa3b80fff13890358e88dc2abaeead52f97d6300e7b375a2558265a1547f9da9b4433aeb4109df7bfba74cb6c712f01822016bb5151a653957d4297003f217d41fc32f9eb"
        }
    ],
    "color": [
        {
            "id": 1,
            "title": "Black",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlack.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Black.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=95f8b0645bb85de02cd4248e6db5fd53b225659d55c1e3eca3e45dea94b7a9eb84767058b73c4681bc0948cb34681994007b479d969a6716e7aa4b01c531492071c15dbd833de2c1d372416586566e9d1fb34523e7c055d0ca43491d12b7437ab7bc4fcc5da1215711adda450d7d965670233b49cd3bfbf084aa1e0d6f6619b3bb7534b721b88c8190641285f8ef14722fc3c3ee6c9a1210902ae0a06e887adefe4e940a104822620102ce2f4c8ce67c624823cbc8a9d3a37f6372a46aad00ca25bd709faf54138f882cd312f94f95ec1b05ff3f1cbef71b4014fb0c52a5994da0bb1235f35c1369c2bf1f260272193a32150abd8a06ed7c6663357590b43e0e"
        },
        {
            "id": 2,
            "title": "Blue",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlue.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blue.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=60c1126ac0029c9f2ac2b21c334a184a9a0aedf1f1158ee6479b91f5cf238a10c2742954f9d2492eb8693e2c7c4a66ffab55db22fbca942fb7852b1db612d7037a0357f5b7a9f8e1763afea6f4a45fec74c7fc9a0a3bdc9034369a7786fc096968521aa79d01ebd5ba0f687078fd97ebc7c8ddaaa2d2e94f65e17ac65790b7dd8700fecb639339853157465c163e6e15c8d3dc71e30ace5abbb21f867a8587882fd0c66ce4efa7f792983e2678b0e59ec255bd5b3ded9aee9cc0daf2ebc9fc907be1539be5fa2db527a5fff2cd9950ee378577bb92fc9d9e5311404388a110cdd08183439831d7b7d56fad58cd9389852f8924655946e64c1682ce618d6abd61"
        },
        {
            "id": 3,
            "title": "Brown",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBrown.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Brown.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6bbb1e0daab8672d134926766bca2e8c542e390486209af13491e5c65acb8ffa13f4b7bc1319a295b1712291095a549d03db6e10ee7223999cd772752f94f6fd430d5c95266c76cf72dea6d029215ab3ca998c33a2379baf0125bfabe82f4693c17f66a62eaf1e0800134dee730b7133d2a38dec1ce570cbf084cfc0ffc734aa545aa1a493dd96c71c57b50cba7e72b1b047fbb3431c9d9a0e69d02b2c518140aa806fcad41beb6a33c585dd4399113281eb140a09cd03596d0a74a97ae84d04d7d91b411576db590c5d660372d8d5c5b2fd9d9a49eb053b6dbd06da110a150ddebc94a0886ee5a4278d40e390c0cefdb73194c9fbe8d487f286cc724e9a7da6"
        },
        {
            "id": 4,
            "title": "Dark",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDark.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Dark.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2febb8ebc0cb6be0e0616b63613f5e949e87b5d594a6f93a2879630f7aed7d71f8eadcd5e2a6d6238d490eb0f4a556f7cbeb156185c1aa06c302ed62717051d1e71b7a6a75e8446dbdbf698644e94a02306e86bba85897e036237b6ec59a466b636f763798d201310fa9499cbfd824c1a29e9e794227577921c71c13cf00e044edd7410c9025cb3a6f4fc94808a476f938554162aae6da6892919ba2a5c31df9df3f37d4de0c8a3140036aa6a5e92930f9a9b0d2eb68acdecf217d2e98e6713d512bd4c71a84d04ca62706c1e6f328e0944f534646b1f2078321f17a55e47f8bc1e6fc5c0f3b173dbf65fe1e55c3bcd99d2ddf082d0c1bed22e3fef6725d3031"
        },
        {
            "id": 5,
            "title": "Gray",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGray.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Gray.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1b1fe66bf73dd5a909d1b6d3821894845c80f252cafc3255610bad495836ac914308a825f9891b07db3170618935dbe2daaa7f15b9eb2d49a579a559dd0e983fbefbfa6ba61595135eeb0384960542e9674d0233de40e5436b2b77b3ff8646c5dd81ba02d9d6c89414c1f4b81ec415e4108e957bc0449e14312d1f3cd86e7194b86855bdf35f4e41ea054f1ec766fa1aba1d3e839ff9c11736aedc5a4f23a71041bacc81119089812f3e75d262795e18c6c5c580eae94f2d7c10be5458958b92d4bf0032d322700e775957004f9f0048ae2a49fed8e0044daa6072f3ddaba5d3841b44dcaaf7a822ce5fe91a645fcabe5aa5a05468a308097463f72acf9769e3"
        },
        {
            "id": 6,
            "title": "Green",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGreen.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Green.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=53413436bf1cda5525cb343844619fa2485b1da0015218c9640a60806eb6932a616c2185e1969477a9bf6af6dcf48ed5008d666a165d22ed3dc7c814e8fc58ce43e1365f7d0e30dafea3aa6cfe4d826398d4abe7574615880c93f4c9d50679853d98ce3462a96a11c1032e40b788b0f8f4a8e58ef3a952294b5f3cb2528e1686b2c4480a5f77b373d1929f6885661a625eeba06308e53f979017f6ecff6a9d05eee20a0c8fd3ea869de2830264d71c6779115801cb47b97ca0ffe177c226f096e5cc452e0c1d8b35f4cd1986d22d4110632447ba3c3d6828e17bc5f404bb44a53a8eb90b9f7cbce130bdf3f42d712ecef706cc615a874700ac6e82c8e13ec274"
        },
        {
            "id": 7,
            "title": "Light",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLight.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Light.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=27d18bda4c117f4cab4dff896b1f185a627144e820b9a724d7d4f64e915722a0fd61ea2cbec1b0f373dadd8896756df4c00e19b63ca39182fa57bb5222e0f2cc57ef523cf03a0f9d284aab1a26438acb2415138d48fbe049964ec47259b685a8ffdac39fbe0243b784f45e52e8e3073695d62eda2d72c95984fb3dd177c9aae9241643c956eb0d303f07f8e1abd13a1729d10c16e725eda7c16d18d703ede841cbf98fd0eff4da131fa33678c3e2ca68f75bec87c36742e8b2e5538c8cdfd5da1c97d7bac95e7fb1210a131314dd2f18f5fda2a367c49f73eee567403960680c241a992d5cb90c3216d30974d3b5eba4e6bbbc53288f9ab2cc87751481e06566"
        },
        {
            "id": 8,
            "title": "Orange",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOrange.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Orange.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=44cf78c32d5d59fe9ec99ceca8416c39a886fa7165da6e73325ea1e47b8e700ed83f9179c86b7a9f6b2036ae8e2fa57104fc71d7c67b85d67f5ae50ee84395302c39fabceb1a6ce6ed761ed6aecccdbb4ae81efe02fe6a1762b7d0834b10c530567f82600da2ff85c67951644f9980ba8773bce973ea7e1aff1b89a71b398bd355e3e095a7ffcf9950608f88a336ab2dca32aa57863cef7ec334c36384cc53307c9785a804ea35a6a2a77a4b51ea1e9a0affb8e291add0a7999548d78ec948050006a90cf58acaecd4727270767f06c47e1f396b2f54c42e7910d1b73816f1eadf588f044299047d4fa60a6d9d14ed19b7e2d335f54e42f8a1e4a3e06c672e40"
        },
        {
            "id": 9,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 10,
            "title": "Pink",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FPink.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Pink.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=587f2e3f81791137903c968af93eaea7107b4b51917bf14f9116c474b2b72b720cf743dddd6c9317976162759ee7035450d4e2cef727ac0a38dd881a53303c6083c8e225c977593892c5b33c42e4f49394ac63ccf642b47840545d4bcddaf9905951ad7036459222c3f0e5fffb14ea670f851b9c45bc7ab193ac1a449bdf524366b77dc568d9e80200ba21dc9abd63998dc2bc64d4363c3754ce0f08e1365a04c0673745ccfa225b3d8b37128b1b9654a72be7b23bb2ee1d1b1d0dbaab0a5fe3d414f04c8b6177828f1a6e66ca069ae77c56625fa40950b54bd4738ce10b5c6238a9e848e2b4137dee484acf2617a8edc4dbb7ffb324bf84413517b0734ffaa0"
        },
        {
            "id": 11,
            "title": "Red",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRed.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Red.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=197c3307c0b44ea58af8b2c5fb35871e9ab0e624fa4859fbcd5be79097d724d1c39779a7f1e66126a1f1f7c07894a6fc03ff4ac7d56441eac1944d9a9a00e188e20f2866b9d21bf511b43da0dede1e190bff5c4cff45e4e303d91d2f49aaf02d6f696c17f0338b1bf346b15e42c9cb65dfbf4ba015fa313cd399ae0d6a856a9c2347ccdcfacf899da6e15ed0283b4ba50b2533625ecf2683fe4a847bb42b6ede0c80e43658f6d54b55a2b8fd8c63dccf19f61ba03c4003b55d09d67d54a48468a20be88747965a29ef79403be13d33a7a1590428e0b3eee63c71166dce894619bfb145c1ea9d3a3d3165ada39b678f214af5e70a31e9267a4619d611a3f54d14"
        },
        {
            "id": 12,
            "title": "Violet",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FViolet.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Violet.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=24f76c349246f1a52c1bdc6242846b483dc848b752236ea60f1b5d1afc416e6a322a77fff06677b3c3289966b54f8883f0b85de67ff90f93418c68be06e07e13945b7250e20918cda64527ccd13f8d5de68b44d6124d8b26d168441adf4cde765d40c06dcfd1b5fc4c6a5509fafdedbfdd8c046d00eb1c0249169d86efecb59e2a8a3f236ac38b0eebe089f4cfd7323d398c54291e9f6c2fbffd7e127e6e7ec1bd11e34b772ae038dff10fcbd054c8e2f46edcc10958d3a01f9bdb2cc3e3411ebebb73309b53d5196f965633b099652d16509f5e99a06fba1226815db9ff3b53272021f9fb0ef0c62d19551962dc71ea42ee085858a2a6fc5439f13ac1a212ec"
        },
        {
            "id": 13,
            "title": "White",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWhite.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/White.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4406a4c555987f0c3c5427d429bcf3e732c0fd22e1baf3181ba0ea31621b67d99f646267f73e9e60ef9c6bb1a144d14755de2efed1ba831c41fefa0228054592338f35ed17d7409bc3130450621fc4be0ce2e574b6b80f17be4d428aba042e974759c5869f93757ef1e17bbe81f992bd3072ebea2fce74de5a679d6dd53cb35d1ef9722c4fc29d7eac41952e7b88528910d94815ca9f49c34d6b63653b2a195eb6d8d9bc44f0701e53dd338009583fed143b145fa7a2b83eef0c1f208e0a3fcfe45b0b31a8b66cb20ea1d706969f372513c165b3f37374eb65e9e963afdbdb377ab4c4e335e4e31fdfe39552b54f99ceef84af4893e5fffdefe09c7997d86d2f"
        },
        {
            "id": 14,
            "title": "Yellow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYellow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yellow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=18cc2c859e7480e6e7754d635d0356447744e4d79b679e5ebda209979cc5dd1cf7d8c594460365cda3cc6ccd5bec8582897589c970ef783043db78adf5ee9ef6cd74ec082ef21b06047915fcbd21d594934327c97620ad78080db81aed98aa36e5277ae8b3953166cf83a1511288211d3518e83ef61113f1f5bac0f71df5dd65a4e6e28985c829644c1e37cf14a963e7b2d8ee0bcd0e27c7c00720cc0f447ab1a6280b6348cf7e1cfc106bc53c2798d97a0703f2294f2ba33cbed998f1a43a185e28b4dac9bb4ee2479492e283ffc0d200b222001e4f20dc4f7e8cf24484a768c2807405267e988baf21e0aea0a4559d7c5acbf3de3ef8c7ab07f025c3a20952"
        }
    ],
    "days": [
        {
            "id": 1,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 2,
            "title": "Saturday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSaturday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Saturday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8482f4201ead84efaeb1b3e2e43016334bd8b723f78b96c204b94fdb557189c7701e75d63baddd0c73d3003dc99d902acf97eb326c69af50b6d48432da59d1ed3a54cf726c80857b91297988feb1257a7595174960f8b0cb9db311760c90e2645d681b3bd051201864b78d4c1bed8c785aea532ffb7f01de982d7a6bcc1294db606d0f363384f5303909da7ce8755e47aaef569141c445d4a32074955be1787abc92f4388892aa910c6fde1a41ece7cac5fdfb0cd8dbb71aa79dcf518ae2552897b358c71c5924449d75c280f83fb184de002ad094b711c462867d2884cf18e6c8249e28fbfb62ffcd19e89fa248ca483743b321b85b046eb48c4a568af8c731"
        },
        {
            "id": 3,
            "title": "Thursday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThursday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thursday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=552f762c6f96fcb168a66c0fb6f6ca6d0d030f6f61e0b100b20dbb37e94220a1f66e61df59d44c4089713fa69a640c28507e8323671e370977768189e2d1d3601b433ca9221d1b3af36f9e3da3b23bf177fc5ce2323a78977e5c967e620a343d0e5b1890331b8715c854eba015352745e6b9cc8cfea88d07806b626d1ca097b2252d26edf9dfacaa3c2e1d8f2bf91ddae1a9c8636f1bc7a907d1c9ca404247819df58f111ecb012926cff842a2d55c8ea6d4cf2d315df49a7de5c8f53b2501ad7c29eca757c3c0cf550ed060bcdf96d01f4dcb55b1d2443dc2873050e0f9bf99264071e5801d558228919571ee9d600adaac687649bef8b6b4fec30a2dd95be7"
        },
        {
            "id": 4,
            "title": "Today",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FToday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Today.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8a1880528dc479025c5aa9f533b45308e7e5243ee17bfe55c86c72feb64e5fdf8b2d591786c4036ebca549b4c0fd9e15885e9dd1a72d51ecb677375a3ce907ba08703401ca899694925a99e1aa06e87e6d35b0623e1996ee9d5a55fdbe05196e3aa450fe6eb4fd266ed0d13246f86fe2f233a90bee3c515dc49f6c8ec0c0fc083fe51f91f3d3462457a4cf705968ea7c8197a56f8a18361e0b9003607fc85b6a80762100fd98dfc8551211532886da0524debdd84e3b5e8137d409d34075cbcfc325f40d222d06ba7a1386152db633cca2d9a0529e1766fb66e06f4ab79e48d3c8ac5f2a42407bf26c2c142c660396e9184f83b48a4dc6b7f1643d17ccd1c9c2"
        },
        {
            "id": 5,
            "title": "Yesterday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYesterday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yesterday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=726965a7bdb69bb79a24d8c4c52850c4d5a7b05d371213674effe7a271b6f431e4e22040d889042e8d2991754df296d37986c7347af050d702eed8e4f5ec627500720e9d1bc61decc663c7583ddf667e87ad89a56ef9a2cb172b7fc756a9806d5aba98d3f918e1835c522d0d5a36f175a14f8542ae9662839c9ef8831428a5896ca944043475d07910107b1393215da233cc70bc220552ff5d36d5720e95ef0ed2e9118d9bc3ce5964eb9f62fb816a7a645dcf60d652029f75c321c580b606897caad117f112780d52bab8bcb226b7ecbb33b6bb33a3fca4b5b831ccf9d6d2d72e74a252d01c9e3faec5ac3a7567614e97dae853cf57a9589528d9553b123a1a"
        }
    ],
    "drink": [
        {
            "id": 1,
            "title": "Beer",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBeer.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Beer.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9d4dbe2779fa1cb991956d5fb2a85ccd8f0858d4070958cfa6a12f9fa5da428d7594f4d1ad15f1d009126954f843269a6d41c1f423f57d3c4045d01099f43d536873a9ea763057a07581d907c5c5504be5dab77d21f985823e36a3c764fcba92d836b96d5ae1aa7969ae10d866411c5f5fbf16ad2501ea5da23e5f27e41cbf7948ece32d993bc3568114075b99fb6f17e66f785acdd9205b4f703dbd68feefd0cffeab0a11b1262a5868ce17917891eb4cf59e6aaa165e93d127a44c649620da8fe0ee6536747d0d9bb82a577b1087e055fbbd027346c36c51773ce50e64a4d4cff70be5d49224782e3b46b3375edf646991ccbb65cc93017d6db0c49a8c21b5"
        },
        {
            "id": 2,
            "title": "Coffee",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCoffee.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Coffee.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=21962c04c8afbe5eef538b1a51f431ce0b09846134f9976ebd0e0287a225263c1fd6ebacfd9178a5e4cceab5d9c9e366d021ef58a8213b85f8dad5a659b756b00fdfd7d1e07898db5a7578376c017a85c19410fac3756590c7e3b4727e35759032069d600b6e064b5331a2350554fe99c700db22336b1dcc806526f19482aac5356a9e30628892a15e965c4dd63c468aaa91778431ad3f6dd6b3833f5a85272a80d0f37feb064fee1eb256b99deafa7c409e9ac309422e2b9d89d30b6b8651c7f20a6b64fef118506d102faed4b89c68cb467eacc8fce836304bdef7b8cfdbce7f3684c8c63869010939628dd7ea5cb95027b473d8e7f0c46d0c05d69655f051"
        },
        {
            "id": 3,
            "title": "Cold",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCold.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cold.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5dd4bd681ed992d5e3ae5fd78445fb80781774213378bbf428e5bfd032a8d253c6fe07a75d72aadd65b2ee8764bc07b2100ae8762f135aa9429581855afc2ccdef2f0a3a0ecad0aa5bd65887487c5b4919adf6162b07176641248f4e5a1b70290cac53b63fdde4f211191d2e8f9f8b6452a7e14d44e1884762fef8bd01356e256b6c54d46bddc21a6d652c0ae04fa87b01e49082cb843d7cbf79efceee2cf42cf2c5dc74f4feae26ba5dfadc3b3b7f6ef07d21c71816da072670add574cb64aec1e178d90abd39c9179daad4dc0c5f5ac8bcf5fb2191807c80c63b76c92abfebba366a4630faa9bfc075c9892a4f6dafab16fa34b783c9402d076d903822b01e"
        },
        {
            "id": 4,
            "title": "Hot",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHot.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hot.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=28062ff573217c3dcdb309ab93de84da6c76a7ab4ae286f8a3931ef1534e7a3d7823a947bed2d349b9881eebf7b34c3259214d8f0edd03cb0c0e6111889dba697a74431dcfc6577213160a3abe463ca63c2a5af12d0395c991aacef77bc3123414b77a32bbf7c00c8a4c30c1bff09d1cb3b7a3bd2b16fb80456ab7c3e514d1afd31c28a7f8c4dec0bd74b303a7a4c47d127f0337a790d1aa1ae1ba893fcc742f99071e05181490db9a8ca45489947fdfe6ac976893d04e1e4209ba2c8b800f88c4200d0b587da4102398c237e53a22117994e2bcbd35406d6973311a39d7d10ccaac14b9b77579ffc0a8a2c91c9862e1f85237434c877054b5fdfc2e4bb87340"
        },
        {
            "id": 5,
            "title": "Juice",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuice.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Juice.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=42e1f06bec8914792c2f5c2c0b691065e1b6d513028b6ffe579930e771e697458be85b44d00ee6db1599048b1f76a84474f822ef2e847dd8c7e441e41286c7ef7604a6f69a36fdeffff875cd2fc4de5527b91c4529b121dc5462f13276eb9bcf5589aa24c1718cf4fe7c29a95f040a3e05b7aa3b9e0167623041a272b5a00d580b62d0a4113024071b180c4fd7d551adf2c721cbaf6fc3ad60babb30a347a16825b527bd570c67603ae912eaf8396085abdee657f3f27e4149ea6fe26ceab5881877195e91d439122b1409a7999396f0a984798d845e5c0fe687cf59ef948a1fb1e6243a69b0e73a9a5f4f8cb897309ce7a128fdc9ad8db6ba35056a09e93542"
        },
        {
            "id": 6,
            "title": "No Sugar",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo+Sugar.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No%20Sugar.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3292281f02a840234a0e61ecbcae97cc42a78bb6415dcf7bb9f5eda96e38715711ca1c8c71daa5148b850175252a2f345e1de4b7fcd7be735196ca6c831cce665ae757751a8b7cd93d88b0a0b7fa7bc9cb21b15e303542e155156ffd08c17feff80070156de46730f2328896756b7e11fd4b574df78d62ffeee5ad972816cb057f56b7172af24163aa00bb176e6040966da27ab00b50f40057c0f447245d82039321d972c0bd6092b7cc45e74b850b7116f6616e71154870cc1b721c9c41055da0ffb9e2bdf7541b9ae89cd03df2e21ec36cfef6a99d187461db1fbb13cb32321e386603e412445476c86ccabfbb0aa7b38b613fbdb3707a240f22cd25c000d5"
        },
        {
            "id": 7,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 8,
            "title": "Sugar",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSugar.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Sugar.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=253b68b9ce06fbad9a7d52feda82a8b1df43c27efabc7ca99128f3031c04bda740861e46c42548ec5ce5563137fce8a917bb21e046d10c58db5c2b27543f35443eb0f0a36b6dcb55f1868fb7316843a2e4ab892fcc337b2f63136f588052def9d053c41dc2bca5bbe78722f68fda66f944a61ae879cbd684b76f8bb447ef123bc1828fb161207cf3c369108409ffbcce22574def39f90366ab1fef0664014b8458acd54c004f96733a171b88daf075a463cacd5e1c11321d2983c387fc4f55c06c57ca8f7298e5fffed176f38a2ca2241b7014aa2eaa14bcadf69c5ca0c76782135aa6ca57e357b52e7306d8ef5bf973af41740c905cf87ca65326e1f90145bc"
        },
        {
            "id": 9,
            "title": "Tea",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FTea.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Tea.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0694693fbe3299a510bc7eb7cf3ee9ed9da9c05dfe344654fbacaf7d294eafbd8b95f69dd80b80c0cff54a88e79cf815bfeab34350b380ad95468de6aca70fd41380aff4b6a1655159e160b290d8df4b29dafd1f2052f046812e7bb9a7ee37de25f19487cad8384ad355061782bc686131b7d8a8f72dbdf50365cda578628632c64dbff767a9dd86df13a9621ee601867bd3e57becca3558679daa94bbbcc7de9550dbf6ab7f16437092c0686be0e5028e56ff5990f752a773827ff0d8b1d47349380e5790316989b57bb5ad822b3458e3b47d2b3a7af83f20bc6b3e47ad7eaac405491d90ecdde3c088ebf480a3a57183b6f92aa78faabdbd920701b75c7a72"
        },
        {
            "id": 10,
            "title": "Wine",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWine.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wine.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=02e05d73ecc63673866f93509ebb3a535262b272843fa9b831d357c621b45a0571f21639ae50798bf74b07da2900d8dd725a40c1d2f87665adefaa0623c1bc425e6d9a29b6718e9f41f1ece3365617c50e07eda26f8aa77aa7a386450a53558f77a2599610dd68425cdbaa9eac1ec71194f3b82d0606f19875665039242abfcfcb3f626507fe0c1f26eaeac7fc585b09f378f94a10c2297eb1f37db5f24e66aac7bc473c3b1c8859da04c5564a0c37790687d47edafc116e9028a5641a5f84642db91810041c41a395361a81ec18267483b59ee615173e0bf04887496f28e35402eb599018fecc5e532818ac2dbeb36a0b63da4a91b833ea39bc543686c8aebc"
        }
    ],
    "family": [
        {
            "id": 1,
            "title": "Auntie",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAuntie.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Auntie.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1c08d355a21fe69bc65d23c7c2dcc6efa38f2537bda2a789227d0c57c452e988bb9ff1a4b74ca54234ded124bc174af25a534666237fd4c94aa07951dd609cc5a09e8e75ae30d4a62144fbf652222daaf76dd19b5738cb587bcd691f48c1b756e586fb4532b751e6558af712906233c61770548524f54a77dcc444c7329d5bcae66e4161ff987fe5bc119e249801b63cdee0d94d1be999000f2e1b0d8b2d94bab88c00b52249bdd1fb6947e867bc9c53cbf3685415df00ef95412230ca8bd9154e9a0dbc4f7dda431d38a3a486443b5e43b134b96ae4359d15281cb783961ac5971e9ca110e3b269708778b9b42324acba036b6f6ec0799703e01fc4c4fc0a84"
        },
        {
            "id": 2,
            "title": "Cousin",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCousin.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cousin.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6aa960743ddd17757e0b1f26867b9e4c88be1f5e22ee536f26a9cdeb833c847966ea34a46f54d6e972114d66d4e26f5914010e4eadfcb8649592019a3a002529f92c8a4bbe71efff838ccc067109b0c34d375264ee737cb24c820b834b9268942a5cd3bf033f9ce4e709ae45aa2568e30e13641ea4c8729a34d2b8a740850eac6ade175d881bace874d6326836f62a312e188060528dff6e6d68fa1cef1e17854d6ba01d32adb40aa51c9d46edc31f4278b806bb53f78a0982038121005704d37f19f389bc3d4bcd713005bfc17c38d4de5511f7500ecc837f2d1417e6677cffedac3f1339159bbc2771a95946177b6d4cdac6cc28977dfade45933d830e6d1a"
        },
        {
            "id": 3,
            "title": "Daughter",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDaughter.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Daughter.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=18ede2792a0b8e1c4cf89bdaa4803906dc6ebc10ebc4b4da4d5f44daeea67b02ac2ccb66de1d3bb5e2c611b6f2e34cc667af59afa60eedbc101f3c7f8b61901c74621058315e9a589b234aef07ad4deacba31024f0c804bd94b90660ea75a3884fe339cd1f322e6cdf39d7dfb4e4123955636dc50fe9978a305b5686450379816294fa5efe63cdbe4acfca5ea46ca691d2947727a50e18c9b773e88765c5eb347469b25c9637adbb0942da12bfc4256074cb256843386f2dc22449040b1e2fc35f722f44fa9fda6a630ffe4aae78f01c02e554395e6eaffd22a40979ed064fc9d23fc13fdc968e166e169555636e8a9af0670f8150b98578d347d42b5aaec4ef"
        },
        {
            "id": 4,
            "title": "Father",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFather.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Father.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=64a969938f1d62e5ef38a4da50acc59186c1c64abe69bc1b71ad4df449e63734904122f7309e13640543b30d1aa603b40dcfe5ea5240898a5d4d9b9b75f2ec674d97f84aabd145ef2e23fde3c9d81bfc80cf7231f6ab6995358f4641745dd4f009e47ff2e26a29eca2233fc02af5809114d55f357f441a415055d63ba709bb2001a582e6dda5c9996b525c8546311a2749322510d56f8bf5500c642aaecdfd2fc87a3faacc0d4e9af4204385bb58010ae592639a56c2a6a2ce3e29735c4fc1d58d1097ea16a36e35e2953f8b12044c9e039fd281240d6f6dc15785d40552a5f24bf7c07793d7fbac2eb0f8985bc3e5fb0b2a207d883f99ea404b0cffb541f42d"
        },
        {
            "id": 5,
            "title": "Grandfather",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandfather.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandfather.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=38fd581aa122224e4de1c751dec3df41be942b04761ee971567c6c55d5e5e0a12c487c23673953afc9ce86bd1a6e7bda9c92eda0d609f8a94127193649711cbf24fca87d49eb0d50e4aea41c2cc6d3019c6f56a88e233365e7b3594147ff91f875d75e966c406c87819bc867dd92e31bff57c98bc18547900a6d0ace9d28755ff0efb5e3d809cdbac195aeac5d2bb42ab1752146693d56e3cab7dde1c1c4e41a739018fccabfcb16f877c136f5147f06329163a57470e637b1be83a1855d22e975e6bf7d8a3a0be7a1267712dbcba87e4cdd443bd891dd57d30c3efb577e997a804c7d2a7eba5d85005344db9d7cb9ba0c1fe36157b6a1ea8880f2f02b15a9f5"
        },
        {
            "id": 6,
            "title": "Grandmother",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandmother.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandmother.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=79ee6be1de1b0dc9fd966476aed6a6bf9266f4ec574432a926cba114ed43a692c58934c2919a2a73476dcf71b992e73b51e2bc44ad5cb5170f7ebea51862ec6f50b445664d015a4d5d90c438c508e1bbc9ec589b83cefb9ab5f4d0c93f43f9ef97579f7c5d026bea0a1f409c0a12b5df8a8d82878913839aeb4dd9990f94586edaed2838161259f00db556dd12c2c801b1f67e678cd8f8577eb9c9c33ed0844a128360f56f4049d91a1ba4f2e1deaca69de5f4cf4a9ac092e5e6a7c1a4223240b05de374bc8017649af0355d592f136bc4406f01d18040122fd3acf0bfd1d38194b1da53b4aa3cc4b835f727ffb7d33e40505971752a8c4b37c92b1ed89addde"
        },
        {
            "id": 7,
            "title": "Mother",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMother.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Mother.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5428b3185fa89a7b0260a68810c69a37262419fd4593b2875d03736219938277e7d7d39699461310bf14d672eac0f194d932f3c7f70e588bf58336d1a82b78282b439ff7cefdf4e4ee51104c65f593a739fae4075fc2b0cb87b327239ab86edcb70996bfa510700f5ede0f4d1bf6cf545238809d9425085e3f7f88dc922e4f9af229f96bb4a238658236fa774252032bb1cdcdae0dae66f98d767ecfebb0665048af6a2e7949d9f16f493132534306dfe5dad29e47061ad3b8993b9c094c63490f73fb161e32f5a6c7ba30e01932f3f63446f42525237dec53560e79d8e18f788e50f7faff899b8a68b4e9bbd030ba2123348adf9574e6ea33711a95a166742c"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 9,
            "title": "Parents",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FParents.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Parents.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0f0aab4c6064fd97029c00eb124e062366ed9f80c66c6d6dabc81c27a3fff33ab63e3ac343c7e5eceda785d88c35997826a136f8eb13cb4d7d3abc13850f1f4d7ce2c13f6aafa0917027b6548b0aceac9cca29b4b4102743baff6b55568b0bbeedfe9e5c198ca4c3fb84cb52eb3d51b42522ebedf1cccde91997325a25e4f93aa8d17cd2d4f92120e032376180da5cf177c67ed407c758393b077120b2498b7da3a66cb3a0bbb1eb49baa6cbbb6e13d03fd32966dba3273f148c5b043e86e58eec06fb30c1500b630c7c4f7949210a723cb292c8e0c3d2be002d494b1aae962c11f7c68fb1cc7e831c1b39615e8dc014022d4ba924effc671ce3fd903a6ffd1b"
        },
        {
            "id": 10,
            "title": "Son",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSon.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Son.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=77ab61c57248a1291cb98a6392f6a09e46ff27dff4d7e7d7887bb90d5ae927ac1fa711f6963c82977e7a2dbfdd0796a8197dcd847176c8c42653785325ce348bf571d2e8056f47c9bb2f9e3391ac9f39ec04a25076d6dab655cad3d71c2386162985b4ecbb4d028992b1cf6d0bda95c93cf4b85f0f5a373078fa08325db94620ce84e64bba7fba50590cdb6ee6d67b3cb63ed779c95ff4cbcb4c11295a383240d0674ea16b543842887374324ca92ffc0d4ddd03a4bf847528b857824ffc90c9a1601e0f143e2dcbddbcd5accc34318b863d664c17f5dc72f9dc3a4d725bbb969d9784d2ba25830939c333c94403dea908244d0a121454a901cd5532a1c7cfc1"
        },
        {
            "id": 11,
            "title": "Uncle",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUncle.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Uncle.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=97705833af2532a3c5fd2dda7478324f44ad53ee771841a04f0fb9c8cae65dd97f44178af9b71fb69fd8f1d8c24e4cc62d2346bbba73569d676f0d2c39d8c5f5d179d7592a755945d52086e831dabb121ed00b1400104d230b2c25acb587f77ed7a82aa91fa2c4eb509517d79074d28b3f693ee6163aecf63685da1fbe5855ae6d9c1c0025625946a06a373355e750fe9b533bdd72fdb4eccb49fd535bc242d3c6ae2ddf16e94deced7cfffc520e318a50a86c5ea41950ccbbe3f9cefee01afc52c010a696292d065241d45db7c39353f6743c63a9bd2958895a6686de157e65159f0c8c7f201bf0d75702376a4ebdb543f04fc0abdf2f8335e45f36db01e39f"
        }
    ],
    "food": [
        {
            "id": 1,
            "title": "Bread",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBread.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Bread.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=577bf1d3a1c2cee318c68c8d2eea3f54a0bf623ba1617406435c99731409bec4fb9c58049189e480cd85e9b036e618feae3b4a5af80c7b50dca11be0de0ac7bf1cb0b1fe612080c61e7ec51e83e3f752d8557381b33a840546484c5c69e532efb8848d348f99f10d3538dec00dc9d7675232f9375398ecf82643bc8488235599ae64200d71799b75ff981f97a575ade8c00587b6ce06c8050f142ad1e1bd5ad79928bb7150ca48e18f5c40163c3cfb6bf4d7e28de1b1f5dba53b7fdf88e3c87a86268a2f640c5463cb56e075efb70d78daea3b5ac996bd7ae5ab746a96860fc9c965830305f667d44ae0b6826f02e1b7ccd14af113bfaded2858462e528b26ec"
        },
        {
            "id": 2,
            "title": "Crab",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCrab.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Crab.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=96378b880bc18226f86de675065c7baab71abdfce358ef263c334a80b2e48daffea8d143d160af6723734996ebd6cde98f6563ba20f87c44f595adee29200bc5a2960a29c38b77d403515e7cf611d5515c5210df3a71821d6fb1d8c0781c399139f03196701b4e41546693b4cb7ea309213ee52dd3f9606c56a3aa5cbb14b00407fe55e8b0c70e32bd93ac7b000148591b2917952a8c59f9db37c97fead2426d2fb07e9bacbc3c6a0016e165f1a5fc75904946aebd2f7355945a9abecd6ec22b24f0ab1d68ddea31a99a636b166027dc29210061c3708d17151a54e82aeb25dda11981ec797e3904049b1f6ab03e77fa33326c1a9903f8fba152591fc4364055"
        },
        {
            "id": 3,
            "title": "Egg",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FEgg.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Egg.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1e030ddbb439e7c58ea2c6907da8efea4bac730395873b7d3d153a79b0793e8180a02fd5398f3d8d983b119ce471bf5a3d6a281115794901e6d51e85b3e97566414e6114ee992303f414c1208e7eee84894cf8628bb84104681475dd403accbef69edc6823e7cd1fb2289ef14ae239db6e5326f53d115d537fc01a1e522aea71ae40be958544808a37c74583bf76edf1599a445cfd48a91da16c6f4e60679d14bb479f9b8a178afc4137aaf7178169edf96f7886d648bc9ceaf10bf0e0b8db56dcac7bce304cfafb674cc1005f6ad45694c891819b145e409bb22d8bf09b0586f1d844219f00e1f78bfe9785f74c5f8ff4a4f0107b02df45933c0c74ce09260e"
        },
        {
            "id": 4,
            "title": "Fish",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFish.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fish.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3fdfab30c247b558525973b34b778acd681834b34a1d06fc49d49e3536f7673009bc65b54d0083050a278de57146b619358906ddd8ff326e552ea5073bc508165ea03dd3925edd44c248f2998b06b89bffca7253f32abeff2531e27f617da10481cb864ea8e981c3b7fd75d8a13b7ace5d3f89bfe2720cca784e5557797524855be14595560acb02f50f6235e65d0ac96032dff405d0df436bea311021904982249440fcfc1fe6c89ffd237b1b8c37f332a6b717238f5e3d871b9e429ff1ae830170ddc873dce4c3e41d177f2db2f689847113ff6d3c2953a3a511cd16ae7ba6c0c1f2940cfc761025c743be754a571967b76cdcc221ed2cd2c924f36bc05d0b"
        },
        {
            "id": 5,
            "title": "Longanisa",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLonganisa.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Longanisa.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9d661fb4a551a8a18e7a575b4ec30b43c5623ebd9439f4c2c6787e07551b47448e36c3aaf9ef37ccabb266d9f3aef7fb133c05077b63ded20596655f82a15ccfe0015d878084e029a7570b9cb7b8b08a5ed0f98b01f277f9d0abb85fad0fb6af7f70257949dd1c99686cfaf3ee89744363ed22521f68f4a1aa5d83fdd43e7866dc43a925186fbe306b06ac606de4922b4cc83d9a7225661caf31dbf8ec1f61a178617d2269996ee3298c29a02d31873f6ff2607c9b0034fe624b366fec3f7e826c46d98d964220cbef8395591cb3739ea69ac4f9fb886c906464f7a729806f9d2664d31fdf10fb93d823e99a65c0784415558f03d2c8d2b97d0c326a78bc9c88"
        },
        {
            "id": 6,
            "title": "Meat",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMeat.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Meat.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=02e7839ccb04d5747252ba45db541f320e0941de8fb37894f6d0da2fc772c24b24ed6fa24b53bde3f31f71231d38d208379781cc6dfbe76e6c09c3e44aaa1033ee35dbdf15c382047077409b6d5c5a3d61fbe927afb7101bcc67c1d7261db823a68d904e1ec1844fe58c1b0dedc6fc6bb9eb991740045d86f5e6b5405cfa4ded5595b3399da7b733be315897a685fc02565a08acd8f21c7bdf9d2d71293cc13190e126bc73d9abed6519a1acf80a9f5d721f214d834a5f83f41a61868e9eb38703abb0de16209e6a11f700adc26fba1451392c1ff107ac958a5df4bcd1208dd4e2b65d6ad011cab6e0f2624a4c7cc12b8c110385f56695d1621fbd088a6427f8"
        },
        {
            "id": 7,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 8,
            "title": "Rice",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRice.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Rice.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=893280c388601de300d371e5b980d120e43ac9a72e0cf3336600b4bd13d1ee3cf5b16ac93cd13176ba7c86f788aff5a88532692a34883307a127fcf9ea9fd9a5d89b1331f4fce20f628a7be183aae196647726cd9bee114d7acd31bfb11fe0f7d746e5c6cbf9f98e1408a47c30fdebb91da150a9ae22e549c81164f0d5c1b4941dbbe2f09a1f731370152a7bab6ef8789cb012efd205e40f3eca08049bff2087643eb35c8b5050be6304b818d41188ac388c404ab5e5a38976f10cccc4c97fef654e0df6514953bcddf0fae416b9246fed84956184326e91334739d1ec6ed3b9afb72465976e65d94680e7a2348bc07e507f2c65f821e62e04da046618c60449"
        }
    ],
    "greetings": [
        {
            "id": 1,
            "title": "Good Afternoon",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Afternoon.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Afternoon.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=709cff53b537c91592299639c7376834bfe527de60e6338a4a6f76f96dd000298ae7d15a21e3c1cae625e95478a8e10cb5cc996f7449a7cdf8e2fdd7ba040b30191d1bb4f45abd2d28e252ef13a1b70f8e2e2bf69bec9a8c51937f679d67f54dd9d9bef2d440d51f0416b9458e96fc94900746a7f0f5e7c6cd96e2c9935948376aecf76a3f3001ca35d3276e47fdf903f4e172d50cadece8da45d3f670e7e7836275c1ca435c1eb2389925efe0999a3ed5a2ee4c3921dd15c171ace0f54a0ad0f90415e064a6d28a88abcd82b6e73b784a0dabac0c9f0d4494205bf4f5aad534a277fc7beee5b7a9c4fad0bb359b56ae0bb1222b73559132a290d76b03e366e4"
        },
        {
            "id": 2,
            "title": "Good Evening",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Evening.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Evening.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=594d61800a49a79d6e74ce8e6fc3077134f1a8ebe17ad5a9760a8985884759d419131e5613bb32714b76c5d892f748faf1f2b291032af65142ef9fa759071c884938f3e4c6c88b22e512579cb3d2307bf72aa3114681aff0c4d98868f7475cabab2b245f433bc16c9efde8f3e3ba5135546acc104961ed5cff3322989f8a64788b8d2f150f72ffe4eaf9340bda6f8fd60fafbb7e79fd9d9d06caffd445da37ada5a8953ed87d42764edf2924a37bf797b2d58bb82580e9d00fdd6d566b7fe95f8b7ca6ff5a4cc2cf376d87a84727fe40fd14a206f671cc10a046050137dcfa15a6636b5ee306b1c4b3531e955cd946cf152ca0c19fd55cbd25b5b2e4a90aa118"
        },
        {
            "id": 3,
            "title": "Good Morning",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Morning.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Morning.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=97037b11195690c3e64284884f436f2e6d792a818ae8bef787b9887b37f3ee3a039ca8124038aca04e8a5c6e86901d539769ea0f3717a72458dab936c3e05a8c5250f3ed0d1f772e9d140cd96c6f5b55a64bb7e63775fa45a8cb190acae0cbce21ba909ed5e6061d193dd994cb93201c84f9b0dcc4b093e34ab9668964332cce531992ab17c7618f580b344b600d348278764cd80650d79ce70d83c59056669e1c8aa0daf418a4a98f7837ae441dc7812ddaa6b335eb831fa9352792123b92774e6c0357a171e1fb90f659bc30b7d9eb21d7529456d5b0ef909033ed6850885859bd0b634c55dc2dd9021adf19e94047e8f1a53e6a7ac0b8aaf0da47aef36c1a"
        },
        {
            "id": 4,
            "title": "Hello",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHello.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hello.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9a402e5325b43baac781abb5262dc7b097a1df6d81a23f5eebd9ff5d2ba77e3b4e3a66c71a023a5a46f7e91aa43f51ea8213258d12703ad254642bacedddba9b9d60c197dbbc342dd5dbd1970055bd61f454dfc00cdf11cc4cd764ca7a8a2ad4d23b1ff9cfb2786d5f8e0a2de80b69b8c441699ed23d4b340b19a7554f857801e2a033425c4164dc9a4016f72924643c34553c6d6c95a811b524f1b62692308b42bd818f31566dfefba2340d9d01e6a0bc9aafc6316d4048fe83dc23fe6e5b53a375591026065c1c4460842087ead39ffc41eb47ce2d010b372d005b6c1fc88c55d598137f1fce107fb9561900a0a2348c8488266dac0d37f8be36c3fc750599"
        },
        {
            "id": 5,
            "title": "Howo are you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHowo+are+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Howo%20are%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2e33506d296ef281faa2674fad6a9f67e3054a6ac8763ae647d4f4249ae24971fb8c676e6777d1698b50dfbd9d8fabf6aac4b9e3376062c841331d54994b0751b5a59176b481fcc67f3b31e328bd22a0d1d1687ff22de0952e8e697fd14829c4d85034ec4908e0666fadc04106dda9d749cc10031569017d85369c91d3b143b209b040b491a46234c22d0ded159af1721732a7f2d4661c79a6d13c34e620204961c83bcb55ce7c999e5be20f7d990c87d54863411f80a83554ddceb082374b54f46564e14e59e36eed736950a05164b9e20fd3d198d3c0797258b56d704a2d4707e8dd3ecf2fdfd1e3d0b15b0bbd0f807719183ba0a4a29206a74913a803b0b9"
        },
        {
            "id": 6,
            "title": "I_m fine",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FI_m+fine.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/I_m%20fine.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a0c0fc7591a8c994a8cd073f87e288a0cb8d3d861a644869851914094a1cde26055e8a5154e14e0158a558e3b07014b0880449c745628a750e75d8ae4080cd3a9ca7ed56eef6dba2c9abcf932a72a86da249f1b32e47f3cb8abe598bad5bbdb102eee2399070e866a3bc628d7d447a99beaaff03e088051f81ccd6b8e02f693ac515f8440dcf53f0bb8d4c8e60cbf36860abb832ea88144cb2c8ad97e22f030449792be547531498a1b9f1b87de068a3d34ab95230010d1fdc468fb10e84d97bffbc3c655f5ecd16ec5e18e866f430e7fd813493ffb352e64a65a44f19ac0a8c65b4826451875cc1d8200a1c673ae3632d7e3941fe1bdfae6129683ca7e7814b"
        },
        {
            "id": 7,
            "title": "Nice to meet you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNice+to+meet+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Nice%20to%20meet%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2cf08957abf761b0f88011d5228318676dc57556a9e04edcf6c7d0e1b96abccdc5d57d5ddbc3243c3bcad705f334e9171872d051d6306bb4f45781f0155aee04eeaf8f8cc960182d2ce9082dff28d89ecc0c967206777c33c47d74402a8a380a54d0ce6d150967e4f9ead3590cbe8c14a7c83d7905bc27c53347544d4a7e3b994c7ddc1d26b70d45cd6f18a33e694ae39a8de1c05b9deddf3fba0d4e08a6444859d4bcd98c2c4f8464e930e7b812544b154cdff8f1d4a1635e919580f989eefaab5d869e895e3f4e4f50bc81811d293fc873a82688bde89fe994427129d8b24e0aac15240e5d6d93c035c88d069aee4fb799647cee3deb7d686e6713e59e0fb6"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 9,
            "title": "See you tomorrow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSee+you+tomorrow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/See%20you%20tomorrow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0346277d2068d49506f0e9ec0f0665a12d9fcb5d2132104327fd25ac099b1806edbd3577351ec2ac4c52d6ff3c64e02113dadda0b316715eb932e9b95fd706e0f850012e068c8d454b5c7aff7fb20b35ba251d75b602fee1122aaa2a4297962778abe63e1e1081bd7c17e3dd0b8fbbde9806a61cf0c00a9e6e159d8d3d3e8a3117c145e51a529a809156bb9063cab27d80177ed7e7b482d737e59eb0459bb2cb6e7b03bfe82ade48273ba97c5754acf5225e8785cb3839436e6ddf5724c177aaf6468d6961a304b20c3eb8f79c1f9e90ae9a4c7b87d8ef0d29c5b8eba219d7da6341281b9022b7b30c13dd168b186aebe7ca2ecaaf6e391ad917f2a83d73af85"
        },
        {
            "id": 10,
            "title": "Thank you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThank+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thank%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=34e16002678ce98c59f47c8759f83d8151d66a3e49110d3910078ba93aace30d8a2fae045da4ef6709ec8dae873696bc18dfe452f6b4e1d005975ea0610e7ee0d723b14ed36b472277ae24c86c6f1ca61124cfc3e0780b7cc38eca85f48c288f72d00ce548ebf6ec01c61a2e7e60a1ab61e2df118d41bfff284841d67a265790927360ffddbb49eca12bfa8b6e2751e144f1b82879da13b17c0f63929e9bc0c73ce5eee539aeb183c791e274efef517b0c2760792753033d346c22445247cbedfb67b44f9373f1cbb5b14519fbfd435e6f9c37f9653952e74c27dd9a9c9fa246072a63ecf9faf088490059ce64132702ab32fbc5eeae56b0756b15b29215bd91"
        },
        {
            "id": 11,
            "title": "You_re welcome",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYou_re+welcome.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/You_re%20welcome.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=77bec0c6b012d0beb95dd69cc2b62dc9a0c738840c1b19a7f5315bb4155857a6c08f2e335d3ae40684727e299ace5ab5246f06270717e53b7846d508de60bdfc6850daab7d4a822148867b385d645fe72291648bc2d3d47649b8c3413fc50a73e3d24751ab3f5da7d3bb5d75eec9593b6e878bd60ea0548f705283838997a7ba8c0fde331254c82047ba54a88d9908063effde690fb4c25d5bc4254870e6b84ffe36cfbb06713e5174370d565f4834bf5bfba21b26af86c5173a9d15687e205f4c8e4794be0c3e5220c1cd195adfc8d3ee16d91a43f9e5d5d9434457b219ed5d950e009b341dd2a9e68d41d239bd55f75ea0ae629dbe04e4311eb25174f7aa14"
        }
    ],
    "number": [
        {
            "id": 1,
            "title": "1",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F1.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/1.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=658ec05731f184937e8bc27ca91eeea4e3ad7990ade42767ff3704342dcf9649155a0f0ae6031d2bf5e904e258d832e9daba3bd80e9d5848694a496dffe6c90a67e611b8717bd4de67eee21b8f9a755cfad0bb237b2e0f9f8c558275c1a6546626c75db95a4c6e43592e9693200d8e53cd8adf9d8950a9da43db50c43f44e3b82285243c4838005e451cdcc8e65b6916cd1a61a03596ff605ed1ec11a69b40b3e9a9c0b66f270ae0e0ae061018645ceaf55d6f8dab2eef8f48402ac58486daebd8e4db462a177704aa40d7ca8d7ee92a827ae2f6e848bd04274c2f364a70f8770caa4ed913175d94bf26553e3fa40dff35d099890fba605426eef137c228a9f0"
        },
        {
            "id": 2,
            "title": "10",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F10.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/10.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=61b45afd1251360042a8b696c06594dbcf5f878b859758f67fbd3f4ce06c648d93777362bf1c228e60018933a7a664e1f1f0539f2e92d7f8f0da4bb964f1516a2937c7e57e6556eaaecd8ebf58ece3e440dc422056ee6ff7009d1f5f48b918414ddd9086433f47fad49e3f8a245eae50fffd47688133a0feea7c493f4829c111292498300f5a790bfbbc1dd8daf6bae4df27579c1582127589bcc1275707b5fe828af48da05c0edab331e5cbf83c8e4382fdfb3897884a8e65de52a2ceaa5ec7d4c29ab0f34d40edc08bd9a064538e8a381a0ece0a929635fbf2f97ce8a192777774ed115c548ee8f1503d3b93701d25d3ea818ed9043115b5dcbaf5a4ce0394"
        },
        {
            "id": 3,
            "title": "2",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F2.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/2.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2f9c9ad0f810331fe8118337398686774af0b71879e66104f61189c0c8b470897d6eb3b5f1f41d09ae08219bf1498cd4fec43804cffe4870b626713ea86aa75b21cde064797eff743b5c2700e72d6651c6442bf3e3f4fb82dabc74a3c2d43c4ada9854ce7d8559ba48e1132bcc8b243ea37e06def56bd90b49f994934b7e9a26229ff56f9bef720b5b4c352f3e2d0b90204152a4b7082df45e6a0d97a644e094ca7e0fe3d1ac3ef585f0638d941bda6fd935e04ef4b372cd66ed1e3ee65687a06e94f94c8e78aa418cc7ec7db6fb11900afa84d390b03c7d3a9a42cc5e51398ed804c842df89fc2707da8ada7a40d1cd0fb20c754c0b030a583853cf6cb0a86f"
        },
        {
            "id": 4,
            "title": "3",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F3.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/3.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=67e8f72b18ce5e7ccbf4489c70ff4a3f1617091e1de513201d4b64fcb6ab3e3c5079db814cae99b459d44c20f862b1004e6524bbaf87b9d86149b635c3be01a4fb8ccbcf49204eb0ad832b07334f719571049149dbf5687ee625a542e19708236e8b8bd57d845f3c1bd80ea7a921445aa8eec69fbfa6f4fbcc98751bc78747ffdf9d2b73c80b626efe4b17cd0577c243f508766cd7eefbcd0d293a273d115b8b207c690f3c405539ca8e035bdf9790dfa293c2a19f15b2f9f8ee311d36e772a36d7288654100782cb0498a74475107f4c3e7d66ffd35f7b51eb313941706080cdbdd3b47349fa65cb00833a8ec4ab7799a70b08e7d4ea566d9414aab11bc7fef"
        },
        {
            "id": 5,
            "title": "4",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F4.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/4.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1cb61d910a7650ee24776394de9d3a85bef3990a84af1513c4f542bd367ccd58a9e655b0313b57a25d8ec7a53bd0f4d25596a2fd762bee88e41c69f351215371b8483557ba05eea73c4395096ec9fd503094953fb90351782f73fd03b6e4a848ca0e5dcbbe112c9514c11dae81c7cc461efa5e7427763a458e6721de9ef0ef0af30577d4e33c33a3acb9aa2bdf36d10cf84be4f12b02f4070b0889f1e0a0b98b001f4da42db209c31bba9ffa7fa5d04556b266bfc1be88d2d2ca1a1e76b9f9d97c33332ae6ddd9929ccbe0a5e38f12800a11fe7960f50e298c9648e07750fe8ff25bc71e4f51cf751ddecb24c1426d91c760665e99e53711400097ab55767098"
        },
        {
            "id": 6,
            "title": "5",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F5.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/5.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1e231bc906dc5bfb52261ec1e3a1b683c4512bc461a68e44b1d1f2db0746d2ba0a4d16b81c13faa54944cf96d69ef60bc04ea47c3d8751f1c790f1946e18cf70ae83da50da10b925b200a6d90be20f7d892732ce603c80655a2d49f5c3a4bf9ee523afc43f0e271864334b55ec93c47aa5fbfa8e692bfe8fee9614496beb881f3c247dcb3d9f2a7790f5d43467df1897a9b2c76eb9dcb1b30680155edd2367e765ef1aa24d2a08be3745bc401c57b06747f9bbba20657d9c49eabfa1f420b6219726f22bd706a93855fd890a81af46e940e600571020564ab5791dadf0603163fef3519073a4146c755e1a2b9d7a9d56869c091b8a64060898711ec679b7f4ca"
        },
        {
            "id": 7,
            "title": "6",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F6.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/6.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=10ebdf118df59e63d1a0360ee414b10bb8c7ab7c350ccb2067033a03279daf992628774f0e90fd6ef5ec6a6ada2f46985ec1b9e68e7d58d5715da2f1494463afef117c994424da01a35f3419a86a1c527fdd8e7557591f914f764339135e43c62dff7b4bdfd172288d67278e32ea26bb0f5aafc09394d92bc3f563ddb502077000fab040bc3bc2041cf4f11970a268627c335d7aba7d02bb9a31c95d24e868dbf051ed2a7958921a476666c7bea9ef09faa43512fd03545c4fa7df519ef2e5b6b588d4e3b17e4262b1c0259aba60acde989f8d0e90f8d2965fa44bef2cccb4840c21ff66a93dd31328745183709f7cf3232a32dd230e3c675618630b6eef7f75"
        },
        {
            "id": 8,
            "title": "7",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F7.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/7.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=89965c57efc42f47880779ca301864af44cf30c2b056fc2b7f3b5bf894067e6641446ea79bcdc1f2c4cb27abeb273e5cdca9b0eef6605d08ebca9770556b11e66988963b0ef566bfe4e894b10617e31cedd9bdc3c052e35ce32b3fee377e68e60dd2a16f6ecae0f8d8f1767b60606d6f3c10e271dad8733f5e01619b9044554e5e31a4e3fbfa656f98eae72d035a350c57528a149a3982f7c1d7fb0b26a1b0a9755de84b90998ce72df23d9a8c9b953d7457eb8ab19326cfa18b04a28044003a7a743cacb14c4956e6cf5076378b1d8827159b3c14dfed639873e4860f3cdcb126e703810152b05d308816e1990fad6587ee022ba84b115208640a3bb62a12de"
        },
        {
            "id": 9,
            "title": "8",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F8.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/8.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=18f2028b887bf5f8c0502051701fa04dc723ed0cc723be3d72565537b1cd59d48737c11eb3b789d8a9ab85ca9fab9f3fd3bce7ce0e6b27bf0f1b7ea836b0bf34e6b9b56481d03392b2e22f7ea84c3dc99a763645cad0f4564d0f0fb8715c3cba069c59332f2ad79b24d58e66fc850df7fbfd59d4b4b51aad057e5e5536a161869df92918aaae757afe6968045b8bb141ce614a00446de4f8b50c7d486dbc68fd0548ef0061a6604e0c1186cc9d75ea4fa1acb7de1677c7079b045950cd25743e98b90d841f0025173738430a354f2bf154c436563a323b2df5c88698e9a00a0b4262d29d7acacc7cf2d8631a66647c79f19ff96cad50129daeb7733618922a48"
        },
        {
            "id": 10,
            "title": "9",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F9.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/9.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=73f684599d6340f91e874f1aa14779b95d00337233f547d26253aa079932f413d6fbf6ba17615ef7180df42879be7ee43936b57684fcd63e145e6d7d412437a0a5d66c427906e51b99984da20a271ab000f314f4f9d7e956875f854453a6e265c054a7005beb336db40b8d924484d4105b0d2fedc4ddea6283c38e6a67e0aaca663ad1ffef0f9865933e881a917556bb8aaf7116d6e8ebd2c3cbc31d57eb307e442be6b21d123c326b1e18fc203fa9b53147b2b2c1e52eea310e543c9c7c819a5529fc2a81fe444ee4f37dc97cbc11d32c1da901a82d5b0be62969f5bc98dda894938eabe1cc00d9ca3809da0684ca1637b515855e19d53fdebb1840dc86b277"
        },
        {
            "id": 11,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        }
    ],
    "output_videos": [],
    "relationships": [
        {
            "id": 1,
            "title": "Blind",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlind.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blind.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7e0739c6584da54f4678545be7fc9615e9c050478b247a3ce5422982a5de3a373f0ac44bce769a6a1657a9aecad86933cbfe24562e54e0487a33c7b9236a8cad4414c1225612b9b9ffc6d28a7450e14069e69f557a8bd2f7eb46ee8b18c09972ef967a4f0d97ae8a67b0b12826f004bdf1a76ea43ffd39346a5ae2c9106cda321c6deefc0d26ac5f1029c498d50ccb3bc3536618f6464f8d1bd48cb31a19a581d2383d7fb4f4b6a2d012b86f035321e50057ba91b579943053945bd8e8d1b4c20d53c23492706d178cabbadea2c99acbfc458482cd358734810b38ffd577ce35416dae5644da0917527ba8a868ef1b0ae7fcf1940451698b75d8d1ceba3a4078"
        },
        {
            "id": 2,
            "title": "Boy",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBoy.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Boy.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=997029a33032f6a297b1405367315d65306939d38ac2bd240ef25366729045e9d868e930ab81e77c958205d572a5a30726d31fb2a6ce6dfc7e7692ee6c2a5a18fb27ec529c3c9517a5b71d4df49f020e9593435fe9e0bb6cf11584d6109249cacc8b59589bdb7065d5359197b8efcb7441110f5cee35dbf9b8cd4e2ad337556f565e7b96b68c59e54ef504f0fa657c95c250b7c7ea4f584ab42fcc6febbe9a07a050f0716b8bb232720f80a331c9d5116ddc61d014640d8fdda1d301e56fb0b97eb4e9026f75d484f7037cff2e4abbdec3dafeb41efb335d10709293b9baaf9114304d5de63f702b5f76634eaee55a818f7f1b69c1c5583c8ddb5a5de138f265"
        },
        {
            "id": 3,
            "title": "Deaf",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6c6d87fd20b94464ad9be0e9629539f50a698d403f2672620daf72fc3860a2c35138fb694c5459a2292c8a5fc87c8507d5c8869169473373611f3a9f5460bbffb919d13c269e113414ba98b7719517a340a58c862225840551c0e808b44c1f39232325dc9d1541a7ea579a04375323484d30a042e570b2de3900ea7d8e8f7f14d2b951588dd541dacbdb370c3fd735d1d65d485b2ae3301441d4838e514c2c2d7fcc3fd2e5a7dd781fc664634b33d84ee73de519b7b5ebf283d4888ccaff6be392828eb8c9db2a0b3d9a01d3e060c892c8084c5eccad125153dd5d724db73c1f0a4eb9d468992894257bc077b873f17c285e938bffc687897d467641aba32ca1"
        },
        {
            "id": 4,
            "title": "Deaf Blind",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf+Blind.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf%20Blind.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=07219597f9d4763e31cc8810b974f768a3af6f722c7437c00e6ecb8dfbac936c68a55ea41dc694591191a0df9de1b3aaaa0bee7ef8e1259f0f1be74240c3e036ec134f75c0bf138f7443c393bf49d1b7227ba9d2cd94c69b8699f2e98e4c5673d280acb0be2e5d0bc772a292f179e79455c47c8cac650cbf0b070d30c9640b4b39a5b6252b262f8fdde0207af734d53396fe352199e2d345dd38d4794f5f96b1232830579af93170e1fa37c7965c550adea44278d709f7698e1880a5bcd09edd2a81b4a4fca938c33278873f44b6ada5f19e9bff153ed477b86ac9d5d8c138a0695f751e8808f0d5a380b2e53eb39b074c27f19e1ecbc7d13533228ebd6cf97b"
        },
        {
            "id": 5,
            "title": "Girl",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGirl.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Girl.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=12d542080bc979873b11ef269f9debdd0828ddc1ff8584a59b1885888c8d44afcf61c1e0eefd8cccc03f14e63ddb86d5b50cd12f96a2236bc0cc924f91f2949a5609344a3ed74f6d79179fd0101f5a2d072548cab4e01f183c892619741883aa1aacca003fbee961d2f7a3722a8026379cc03b7622b2ac8f5de9c7aab009372435bf81d6fb235e590fcd0067585740c9d3444a327b421c9b818d27034da2edef24fb5174bc046f4bbe1e06df9716fa276156bcdf07f04cce35c15b920ab3b50a767da49a2bb578e63f9ff996c1b7382ffaf7a430c6d4340ff77914b809a805af95e165999f86159329c6fe3aee33759f9cdbed169420af198d9a6382d4818ba8"
        },
        {
            "id": 6,
            "title": "Hard of Hearing",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHard+of+Hearing.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hard%20of%20Hearing.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8db9fa1d680dbd6edb4d8e34ed59bcd00023881ce38733ea58974ec23f7f135f4f43bf539daee75515b17b7b2cd5136819cecb61888c091049b471ff7e957d0605eafd207e1b5a5f9624ecc36e33e8aa543f64ed2fa126347a09e16f9b55ea44384a475853a80790b9eaf02e5cd7fe230a33ab46ae4f3392b247d16ae1c5e2a9d685123d046818f8167a61b4217f1bb4073121482deff2583e9977490f38cb9a37803ab8979f1ecd6fd5afca94beb658f1beeee83d38fc8b53c0204c1eb2308d770c6102bf5174c249d4a59119696eda98972b2948ef75c0b8f8eed9eb9e0a6aea71425fcc26ba3f95143b8746139f87e96bc63118b4e8d901ecbccb7d9215c3"
        },
        {
            "id": 7,
            "title": "Married",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarried.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Married.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=516646c26ba63298daa7c7a858e6c06e62bd3fe754117a5afac34ee6268981d29c52cb578b6f87925415bafc8cf5c9284920ceecc93b4f25133321f205da8d0b3c101479ee00367b5682fffb9a895b8b1b1bfeced3bb895f0f6fd0593dc8608a35b210f9d10c28b89737321d365c2556cdc1e4a196307544cbde5fe300b4717100b2a4781bc72c9e1130904c57d34008eb46569d638c814069a5a5a4b3b93ea2101a98aad588de0238858887573d92b987a88276353e3ab870d031bfb4f914f11f92e4c4870f6d1a353550df6aa1badb733e0dcf3cba8ce7e63afa92c35a3d37583c6b3f1459485381bbf74e956483e2189e7a4b56d08cb116c2c959d0c478f9"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 9,
            "title": "Woman",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWoman.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Woman.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a2da725c8f89789157a40855e8977feccef4d83e8c50828e2141de138a1400579ad94508b69248e63ddb924c7a2f1cb752fc590fb059b4cdbd6a402b720781a9b03a5be501e3b52ef46e39363ed537469954aae437c0d9b7d6869fd59054e0294a1c86d846cc8cb0fe9c81db58d1e3a4942e4c000e6fc5b83b308134183073d9ec9b65733b004c8d14d354132efb5cc101c1b86755596bb31185884089d6c9fef37d3c27569abc4bbc93f833a6d4f93f186f56b2f29eee855a1f0f7113cc1fbee2c3fa82bf983c2eb116d6d99a5bd29bda1859383d7c31584015a1705ae2eac387b40c27c9a36b2943c4779d27671861cddad27a069b375706665f57b541e025"
        }
    ],
    "survival": [
        {
            "id": 1,
            "title": "Correct",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCorrect.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Correct.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5a75b290f5bc30d5e9a740d7b0d78ec3f9a58ceb960bca8579c4b8b8a4cf792786f6a1f040d611ab4db8b7aec618083c42869ab59850b10b169fef4e786a67a5261088eeac1d0d06353126c6987f7a21c68fb68e769e2c2bc22e1688d4516b173c64e63f96f055d256e9f01bbd6ace963cc4303537e08472ed6965664bbb15decfa338fbdf8b99ee9c980e67adadc74fd96a5e52da508302a6f386cb2e19006646e1f2773ff506be995158bdfdcd6934c53dee1b7fb98a1337f32759f766683262e0552e4baa1f74f6835e0ed76530fdfe3e9715f8d1439e3d1f385de796c5268bebc420bab7d7b072dd2c7285ae36030a177a0716b406dc3998a820b5a87fc3"
        },
        {
            "id": 2,
            "title": "Don_t know",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+know.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20know.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2936c4d36fda9608e511dc31176bf04a1fa5bd2fca9cb9deadcf9c7f772d164a399e8c16d87628c8e5fe2bb978cdc3f879ff67c099e229a9b2f3cec1933922f3d3825798567abd3e7391b1c4d523d085d74d3eab64d3f6e59e38db9446989e8c6e0a97f1069fe874f0c54168b534252fd7419ad1b72c0ba25bef6ae31061e8192f8b73fea7dbaf7f632c5ab33803661c2f2e6a4310c0eebd5580e3f40ae1790b7806071e42d6ce29b45f062747cb9b87c994e0f79cde52857de47d36908c97dcc1e866e97fd88f47c4fa5c97cd2cebb919b6cc64480bc5ee939bccb626448f85d1608ada6c48514dd20f291edb6fe28e5114dd21069c2a0e3380e824a1b8cba9"
        },
        {
            "id": 3,
            "title": "Don_t understand",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+understand.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20understand.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4f1136f4fb0bdf6fbabcdf2b678323ed8e877ccba7a502a6985db761f21ba359363d981075dd41ecddd0ebaaac99d647765c597b6342f01f405c8beceec070b9f32a423f2ce109b92d4ac214df462cae5a47629d8915663533d0d4af1fa04ac30aa4cc488218ad9fcba33ce90c51593c7acf146c4b0bf1e15e1c6810edd5df03d8dd6f657a2d49f1aec7664f4598e7aac3da3ca466ffcd670f04ba01bf9a75110e884671d3c8f679e00bb6305d6f66b15653c783650b90e5f891dfb838896993082a2690de520b664a191cea0a059eac52720a95cf39b6462402b7d11f850ef11bfc354c1ccdfe14afc67703029859d8bf5a6e77400966972a234dcef3dce59a"
        },
        {
            "id": 4,
            "title": "Fast",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFast.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fast.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3f92131bfb039a02d3f15678451c1d8b047c8dce3a5355991723aa83d1061544df5a98159d521ddbae9e7f9f6d2bf73e9bb4b300d3d773498764469347707dfcdba65480e1b42e6d4fa02c2be7698a275fd7cb9efa2db20713134285ad13f2c422dca3222542b0146158732f71d02921b624c1f5cbc9d5bd575347dc487b39959ee99179afdc41c9390085ccda788483fec033e8169258a41418c5c01e9fa0d040bfd0a8f1e70df93d31a79856df6aec98bee77e50e718f58db3bbd6079647e2fbe1f2234326519f88da26b694f3a4b8f2c3f3f67d0ea804ba6bfd741c960bae2958079a9e66b74856b3612546fc2f867477847df4dcb4fc36e7db96b2836baf"
        },
        {
            "id": 5,
            "title": "No",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=98cadca9943484721c70f75d146f449a91d2c67c14e39e1ad93b2ba7c04b59d705dfdd002dc7e6fd830ecca70dc4fee1fe6cc762a8a32ea43a6802ee29ac2aab90ee8a87f2993ae6979a0b4147d27764317182a3787d714ad67a4a56770ba0cd2479950a8c37baeea4c23e3018e6cc4eb65f9f65eab519ec5290520c7ab0365410e5ef502f429b4009359c7aab74ca4ff2e921eea8959773c87abec4c551d2eb34ebc7b14486db6a149ca9399547e436b358e943440a5541459d3d6d0f3afa868bd6c4dc95ad6fd6c64996dc08e5f77fb330241b67894d29fd37bc6f874d0a8b3bc83ad192718a69a7882ea029afbe32e9ee0bbaed406fc2f96f5c36a06764f5"
        },
        {
            "id": 6,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f32cf71e2893cf2ff6e91843fe33331b8ce693117185dc056d272661993d5cc4bc42b0d7d9aa3d1d7e6242de194fdf4395de04259baa25c55974ce186ec0d072fb054376607eab3d55632bdf0d9e820ccbae18af94058fd0a04c8c48d481151d3a977d7d514dba69d99e634033c35a4604f8da49e1af99403452d822c11a7e92a2fc45199e0c0890e220c421aa4cd53fc7e525ba0cf00496a6857d739a8621894322008c0a6f3d976dff87986bf9ef9c091d6c713332a15d95448ec3ed532337298fe4680bc9e35cd1e0644496ba8b06eb95f45b367239858fb5452cba679058637375dfff787443e06f4856038cb5c73a74bbc76bcbf15567457c440a31bce"
        },
        {
            "id": 7,
            "title": "Slow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSlow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Slow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1789fe557749eb8d3c4d320b1fb7beb8ed7c87c4317eb311dfe4d5d804858d9deb4208cd116f0d0dc305e98d3f4142634e9ace8f93f076e961082ab1f0e963044b4b158fdcfb19c83428a208912a7bf89114d481804560e750e76d0aa0af9e191dcd32030faf6724896fd2bebac213bbab7f87e087ac5d6f91c18b1ba459c8874858ee2e6a66a5001a41a55f1632fb1991e73a52ab1297400bb8b3de6bc60e040adc42eb91fd87888197808e491225d79a8870dfd503618b5222254e95114936b0ac3e7b4e330b87a1756364696b26c5a6b188ab52a913756e02367bea32e1af81997001f6d4b257661f82cfd0f59f86075686c673806594266fa02676de0809"
        },
        {
            "id": 8,
            "title": "Understand",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUnderstand.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Understand.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=00ee99a7f7b08d4491deabf521e1ef240d40c83a05e9eddc51e9012c0e3af857b0ac3d8ad1dd223a251643903e81cd61c0276e2d518ea7cc31bc4ff39d0c90ee0946252b20a9f5cdddd28f6f1f342717dd4296df7a6688cbe0658177d3755705d27aa3d7b6370c79f21b6540ba4a2a14683ece68215dbd9a971f760bb246a63339e897f9559d3abd79ad403dd01958c80f6d1201d8a83cab6ba7b4af480de92d9c8afb98fc4d2e38b026b55ffc142a4d610f024e9a4c42a92ba5357025f4ad7d8a454cc144b7b8076cddf7e4b079d58e52ed2d7f578bb6725b8d76a3f440eff7d66d7cfd9761ec7c6b141bfe6c5ca4f0dbdc0984ada53ef1c1cf4460dfa979e4"
        },
        {
            "id": 9,
            "title": "Wrong",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWrong.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wrong.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8cd45167482e252179c8f9c74bac4b41cd096442f4d26131ed5dc31ce989785f2de484196a0fed766d42c9f3d051d7eded68914c4b6fc6d62b880049e22ee173f2b660e5cdd22e1c5ed3d2a4b31307719ce2f27643362acdb7daa523d55e46e1733e80175e0be125d314a70f10f611ee38ee3162ff39be6762d0269ecd479f440aa2271452b78a7761b32b388d5bef9dcb39821470411815d189ae8084a0c06c0bfb796c7f003a3fde285dd7caaa64245c92c76033ef72d5401a02c3fe1d0f11e6dab76c660030a0bb531e0a66e1034a0c7379b8aa8b8e59bb787b91de6c94d385d1f2f489b7f9202b3be6ef48254c11c409b455bf459a709a8ec56f14ed65b0"
        },
        {
            "id": 10,
            "title": "Yes",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYes.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yes.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T141602Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3c197ce1e01270ccd473c9bb2ae44b5c0e4ae23ca8aca9573855db301b6ae2d61704c51ef734f885fa0a7ea7de9f733cb09fc2d4f3cd2d0469cdc88664268ad4fd7986d52e4f2e6344eb9cc0fcad4814891d3c0abe4c713f08815dbe2bced39a081abe58edfe605164764521bda0b3c9561aa4d769a8d39a01d1bb3d26204ab6135c5e42777eb852b375d4d0ab41282bd4a2b26f0fda95ef68a400b59b73d6635abf407b338e3e81bcae58abc1a37f1fa16b0ab66fe58a0abcaefa48ede142b2ed583e15a8b440b6af47a3d0eb4bcc10e2fa338263a9848d161c366f3894da78086dbb94bda402ea93c061012fc37f1349db9d25dc0937fc29953c7e38086233"
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
