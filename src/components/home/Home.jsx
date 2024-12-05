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
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FApril.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/April.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4595a1f9b438da03782cb0ab9c6e562c6e43a8fdf2e5c6f349e5ca65e97932fc74e1779b4b3d76a926379f4353d0424f41416e42aa34a74c3a7dbf3dbe4a5f213d1815493ea6f2e8b917009920b0fa1a8481efcdd2cbb5deda1a7fc72d2681b14c20e3585b398d788e6de5f729bd6667252b2ee3201eb4094a6614c477891ca843faff5b5183f9f3f37386854325e3914c212fe72ac8fd3a03e1e7b49585068367c01504778f6b0c2a703df1e931455ad64c7ee250d7cac64d625208622c5f5a698f7ea87cae66ad85ae92a2b591e3984d6c9f3a48c4dc99409f2b3ce68812230a7e48e9ccec25412d6d9565f26cdac719e21c0ae53a920589ee7ca92ffc5971",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FApril.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/April.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=222696c6362f6d857bcf04721c3a0ebb9f687b37cbaaac24292581556fbc92f15d5b15e0957ce7287718ad91af82222a8e8aea08d585fedb081ea12bbf1c3418ddee455fa65774acb0fe0708201f7e18022d6de88368096b41c04f91ba9c721cc4c40f35344170d4bae22fc6cc87bd3457a3b50f607a940db8f1edd6dd05b2a9c6e253f339ef3bac052e7c9455c7c2b45b922acee8e8fe1c3e663a8e61a03a34264e3d73ef69f89fd23b82feadeee76fdf2bd22aec37fa0b0e8bad0a45e62274ffce49370cb542112224d099118106771fd2fb805492e811acd816d7821ce9441b3908265cf51a35a8c683f54664d476a26701e84bb7e8640eebabb5ced09f54"
        },
        {
            "id": 2,
            "title": "August",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAugust.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/August.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4fe92073dcafc6152b2b03484cc83df6676c3e77d108c7fe83ec28e3d931caa97855a5e272e9e7cab83696f2e72178dc4ed35a9a50e8e740247ebc2e9c37d2f01ffd5964a153c8c61465161dba40c4745dad41b3d253a0fa8d0cd2583d7c51fd036c3def1298a44156565390421a934508ab5cb69ab6df23ec826e30efa8dcdad6238c85a0031eafbf4b34d6b09265a71bf27ba27d7b00af1576ae28f29872abb8e5b17e5bd0e662ba38fac9cfea41203eb6f9270422cb1093f43675672556360b6a3d8efddce39b63f388f339cdc768d1ac86f2121bb32df07490c15d219c28b1ff2a0bedd191058d256860b9793ddbe2a3098fa91e784ec99093f5e347dfcc",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAugust.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/August.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8aea4f0f8dfc1ff21a8d9eeef29575cd19f36746dc14d3fc049a402c293290dff30ce79cb9f4afa22b8ba9de1f0bd93448170a49efbbf7c776b950c0bb49ae49808bc5adfa2def68b73695afde749799003cf1a55910b46fa1f5dd362d5b8c5985ca1cb817c24dc04ffc6fb56b5ff9cef48f28655a05ea09bb39b89e16b45e0fa5482dd047cc129d05bf60dc7d59510257723da59220665c4193bb96eca26504fb1e6a7dda57c8f09b3a70e9431616c6fca7a7431c49d23490f18cbfd575f21ffa1d07eb11b4cbb239f2348e9d3d8b9073268d0d08cd518ebe33d4b563429fb48b47a41cf13706969c3876fb3bc2e614dba63075763e649ee1cf1146eed2e249"
        },
        {
            "id": 3,
            "title": "December",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDecember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/December.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=99375c03adbd6036edc3c661f5194a265a0eacd95bb5ef309afd196d78b4312dff4e66179d7fde2b3dd733688984b42a432fc1388423281ae5047ba4d2c987f77501e0b10bfad3d4344659cf55a98f5c39672fb3044aea5e2c05aeea86e8273239ecc4b0ca8aebff918614e60b5be537bb09de8e57ab7eb347edbcdb96d7bb5e89d029d517deec7a12e5d21774c805a71f1d5460c819e7e7f28aa4e6a71a27eb576ac2d44ce973ed17f7c05ff543c5b28f9b6c81d943408c5d381d826adc32e92e6c272d12b6c65cba23666cb895aa83c0d3928066a6ae93238f750a0154b53da0adc99b0e4f9636c268b1030c30ced595e6784e108858d7ced04c6784060b39",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDecember.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/December.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2581a01f2d226117bbea24798bd085c3cde553063967f7090bc430f4251ed1fe5dabbe1cf7b854bb4a9da66d835be9a8d386950e02eb1b6dd6de73ed674129abf7fbc78d44722cd4fd19076bd768db58565760ac85e23809c05de25e4b400b397c000f3a8811360b6606dac0dd91c1262b626bde2ebf455be31b00aabbfcb5fc4f128be0fecbcd6ed2fbd13f05e91460cf95f8416b8ce947e787c857b7cbf11c9afaaafa17e995bd3b0a2f048eedc3e51917eb8d7f59dae01c726c9947398881b7c442a46db725380fc4944b4b4140209f9936f7a84e2ee6e2dc79504ef23518a3affaece465ebfe5e71507f4a281dd187a82e7fad0f4252059affdfe61c1043"
        },
        {
            "id": 4,
            "title": "February",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFebruary.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/February.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3b23965c328c0b82c1f19062c27ff52f96f76e23d696e45ebf0fe889209380fefb596cbb893d0514d5fba9d16ba04890276bd770705b96eb424dcfe7dceeadd906187b00ab6b8aed1b54df08f16f00819add34eb5000852c38027d7923cb56bf0779f0bc3d6757450b6f61f728096accfd6cf6d3ed212104dfd5336646d65a8b97ec7decf2a26d997b12369082b58a90f19d984dd79e3be273625d6c1bbe395ef163236b260744c767e175fde7ba03d5d9b25326d6669d82da720c8c7e583687950a694f8086f5a37a98c1542cd8fc69ac661409026c1a4f6abe6a7ef3ffe1754d5dae34fe04e7dde5f8348f8bded1d39f4e9c6ad4f417b903c1b0a2d0a0d92f",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFebruary.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/February.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6ee77e4e63e40b573d8bdddee57b614e58e8d38967c417330b600736650f0d845c6c4cb788abb75bda257e08cf10e0328c0bcc32114bceab58800909498a1c10ce070c6ed02bf88cf51101f596889cc9ed4e1919848304cfe9be0b7526c75a0ca9401517cacb375db75e5e4f740952ff465d41caec1f4ae0eeb9b37852755b52971bab5512ed105e024311ed4946857eef28d9e7c301604cd3081db40dcab0b9fd01b720edbb0f70010585f2fc53cd85eab6baae514a88839d2e294aace26465d3cad59daaf38c3192d0b25ce8f388cbcb198f7531d8d8724ca589d820eb219480fcb0776687479bcf252c883583693d9532889ff40cfd58b615c4b904f9bfd8"
        },
        {
            "id": 5,
            "title": "January",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJanuary.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/January.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=16ad167288e17c3aabfe2e922dcd5dc044fdcc72a528665c7a93a3a7b65b65140ccdf42d4f48d5d0e85dbe2cae871cadc66f7811a482f1ef5c97e526e5232ca06730cf41ea73f9c8714c5358c18045def78b24bc04fe83a5729f78ae18010740fc2996c5ce5b0d939b3c4a9198e1cd3a7de855f8a8ea3fb05450958202d6f507e26f280e020388a7237dcaaafe92169203e4d7394a32c309559e9ee53af3a2403c1a3859b189d8a4e587d84164f05962bf15d7cb51c195de998d6c66672a29349b2305a3e4974e7cee85077d154ffc47cfe3dc7fe9628ae0ba379b984fae9dbfd9fea92f5c02c606c5e2925be526ab69f5995455c3423905339aa2bd23bca198",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJanuary.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/January.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4af364d8ea8254f6d41359ee2a3bd0f5a1ecd33724bb23b9f07984702cd9a06b388041f6251a3325f34468f757bed1425ad0cca73743545175253e6b7b0dd680eb3789535b3c2230a9c76a852c8430b1c5339d6e47978c405828fec2e77fc4a1117873201e56eaccd2aa117cb9528e13e0ddc44ded9b932c5615393f1116ddafde2522041e4fb08bf85eabb09fab0be8945ead4929b7cad9694e8f05b02cba426baaa40f1b4f11e6be652087108bb21ac8ca5e5865477cd3e906b50ff9f2e1bbebcf7a4f407e57ba38ce9a7d4cd39c24538afd9d8e9ccc9223318004595af3c5f9c7e50049538ca6c303b3ae24f7315033f2cfebf1ff8a760866a3f1c529d928"
        },
        {
            "id": 6,
            "title": "July",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuly.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/July.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=29e9f769699442b264029d79c234a25eedb69e83b18286c87f619f2511bdf863db9a08a20f6d9cdb4cf97ced77f10daa681f939af8b9668794a04b904ed2844d95d370c25aab0a9a222abafe65158d3a49475973fa9d5ab6c52f85bbf6c191709a1dbc832c68e9e56679fbbe459e12a319bfb7483b4ed0ad3d57f1bdf4be034d765b461541292953a2054f253f20d00f40760bfc4bea2bd4995feff0898ed37c8f5d4d85a02dd8b7295f951b8a5cb6f34456f7f38cb6e4c15cfa95aa3e22cc6db4f71b8eb732523ac769da45788c334888603ab37a7cd3d6d39cea1506688a3f36531ad3d5eab97701d5663f1b93aaac23b4dc2c2ee653b7d751e5ee482ebf51",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuly.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/July.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2995f0996f39c68940d68fb8a862865e831dd1c66b4865898fe21846b6d8b4859dc1d4672cacf12d5af548ede08b944619e866f655a47294545eae59c940650398f1fe0c52a0411943fdc91d147dee1bd3bb051793b5973b98e319c1ad78fbb669ecae1564f8eb872b2f8ac1d796899e24520c653cc485c7e6a8189c05cef87836e8b6dbe83fbd6b6e3bcb56b300138f31bcd386102c70d4dd0b8142aa35deca24d425a314440b66def63bbd28870644e371bd982e5a95a0a973a641369bd87c132736677dfe983d158bf71be620bff55c31dc3372618e5ebcc6b39a440d0ecd22838283546cbb85cd3ac05ab16c304378c1f593f8449baaf4f74814a3d07308"
        },
        {
            "id": 7,
            "title": "June",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJune.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/June.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=542fbc5c0b893e90668a3609418140089574c0eba828b177835b65b24b5eafefa4869778344e138e55d845f04bb4c87b9d9b7594b210e47e6bdecd89101dcf8c17e2dc0d974300545932b15458afdc0a6f060e876dd55a944f63908bd5682c2fbb951f84909ce288c009a0d489d362856728b6622a4306f0f5c8d325e83bd7668dfd0dce1700dab8daf2a84795dec1f60685a3e3de9abe2771f0fe67027710c361f05f7e864209d704640b0d418f937dd18e7dde53680828aa52307f05b117f0b9553c1281599e9fe35828e23c0d5f079076009d5e012223db923908d0b6709021e238dce478c0d1367e2164eb79af8b9b8ea1c808a18e450bc4ac02bbc31ac6",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJune.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/June.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=68e0d39963f3242efdd064ba222c82199539c770acf61b03493e7b30c780d6320b896b1720f41da660cb6f295130556af93936e9a4b837568c2cca3acf8182275f31084af1e0fbdab3754de05d540aa927dd7f68cc9f7964f00bf3b5007648e353a1efb558c1c800cf2d38e0caed4952687e1e661a9c8247be932d9258e750e0dc64b9c6eda7d0080073bcf6c9b7859614c3bee43a5286278c18690a8494415da3496d9954199acaa9d290cb53773c401b1d6b33aafc4249002f64f98b38773aa1c5487073638a8b300a65bc963d45ca6213c7c3869cf765796af20a8b571aa5cf09594ba759403ec2cf969de2e1d397456974b567033943d8376eb301bc1291"
        },
        {
            "id": 8,
            "title": "March",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarch.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/March.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71d31270a92b6d046e6b92624b11fba91110bda7f47e72e4d365b00fd4e239b8616959c655c0a6667be225cb324a7528604f8520a7a8587841e6050087c6c990aec1f5f448dc1b453028c4fabe2771d6b9957051f7ced33ad8449b4ec629031f97c926149d00a5dda6792d4e3d1e8f0e13e44be151014304bf4fbf511cf95a93b363e1da188d0c2a4aecee0306fe8d2e456928edfb256ff94a9bf88d4b50136ee43551b40bff241292105d0075eb2043035465644353e93afa09745c202257b09c98de7071b5b04ba487e019edf0e1311910e4c44ac8cc49739bcc155d906118b02f479456e3d37812013f9c7b74adc334acb60312b628ce91629473067753fb",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarch.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/March.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8a81d3ffee2060308948eed8e583a01467310c34515b6b7ac05fd26d18b74e3a1622ce666a22c078198c2ec1a3c4675b91fda1ed39ef76302f051ad9099cf252c7052ea00c62145cd034851421edd1e95d1ef5ebc6bfbb0ec813cf1cd5ebe397adcc9356f89c4dbad5c29bbe9db7c508d240fe66bc19f7612dd84466c1c8a6ecbe048bbbf1b17e0fbf03a9757644054d26670fc474522fef16e4440b210ca2500da09268ff4cabb5babbf12a81beeb2123e4fa7a4746209b9a7b27d98d45985ac6f68bcfb15a2dde613f882bab5e7ee44395875cd3952de221b1a1eefb2b514a2b3a862fccb3fcb3734ef61d2f9d4f184db513a292d5ce568d31f645d327d098"
        },
        {
            "id": 9,
            "title": "May",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMay.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/May.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0fbd27aff30536fb086d2ddfc493d1cd86b8d85696ee3ff27621579a82327807dafc5981fecaecd3cf4a9e5bd7525eab5e8c1870fc2446b614e4fe23fd73133fd8aed0f62aa7c8b9a569e21248008327a27ff404236f33ec2571bdf3fbf7123204c4c51ec357ffbbf944d0c52104139892bf74f2e3d4d597d9e12ac5f61e66534482c22006be9a7a588f232a26fc28f9d33c6c64cc201b643652985aa8be9441854c25641110a8761c629cfedf43e8c97b59dfd7beaf6b718bf161218ac6e5b277c86750e31bc7fc66478d1f6851e82887c757efccc6f7efebee8ceba294121412df14d3cd04850e0ee34ba96c52ed80bf42dbe65f0d8896681475d3e7a5af77",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMay.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/May.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2d21a74609065767b384ffc4d167f3a8d0237048e7d0e2d4a94206944a7d0a88ede118d079780e8a4096e5cb61763c82feda47b811f6d4b176d9f9c42dafd28167aaa3e65cbae737ede99a240bbfdd508c0b713dc4c6420effb1be545c738a152455b7d0c2e35f0b2b5c64cc859d8fd46459395cb6c5c57d95832b14c89a1918f3dbe5d19930674c5bd73c178ff3401e9552bcf128dcb2b8b325524fb4af8442e14364b006b73faaf991713f03153129a3b263782436f2cf1af7cfc6ebea4c0bf7e6e3cf5b98202a75dcb8c7ca609b6a09e84aaa8a5ba7593ebc28b3fe36127b77053f5b9c4c5c39727a067e165349aa0752f73f20be0c3a6874dc2b0a558ed1"
        },
        {
            "id": 10,
            "title": "November",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNovember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/November.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=202540f4fb824844e93a0dd2d87318adcee13aac96cd9cb4887afddf0e7d412c13a2f2c4952bd1de72b64105478e77afbab4ff3cf0576efa04b1cde2c94d6effa702826c18b16bd0eab9f2cca72f3480b99f0115cffd97e2dda52009a3251cc9edb1d895d46952498e718107f985f8eb8f0542205e6ed7ac229a9218bdcd25c964c7c285d0241652b8ead7f1039bbab8c49972e1a04ffc7d209eaf94bb842d7f35af8d9934dbdc1664068ba153be851af974d9e6b361ffab29841b195dfc1a5bb2504d0058509f7ec2743fc1a0a79001df8978d881cdda144190517938b09b8a5eab5f17f9f702e55b652417427f6cd760340bee5bbae381698cb47c160ab707",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNovember.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/November.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6075312af426803c426c439115c23924a331abdca6988f75490d248a27d07536833528c7105e432ca43fa29901ef0d79b0331f9a3d0b19dda959ef621d479abe5e7144f1862bfc43ccbe8c23ad9026810335830ddb29b277e034345ce89d98a95ed4a7e912197929c59557d35e1d21f76daab15d945fa366e19dbd294e9938c3fbd3b0eaf1ddac3399c114d0447c4937982ab72bf769c460c3a4c2ce249f7df4ddb89a1bea07ade4358a674d8fcadc3fc8da89e1555e22e677440d9c92d057d76e43207a445454e8fcd0090ab02afe091b15fc1a9ebe87c7fd80c04c318217ba1f4e788e69dc90bebf766fcc42c49fcbf19514d4a9d3b0b54efb2dc08ddeb805"
        },
        {
            "id": 11,
            "title": "October",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOctober.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/October.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9e83b51f261c275d42422fbe9d56b677bd1c9a0375adc1e4916a24b170625beccea7b8ab7831456478214569f7abf8c8589472e4a755dcc4b2485e89c3109ec8cf1eecb35a6ecbbc6abf9b2ed84e3b5a1584c016f65b6cfc067fe187989033b6febce39b78ca7f20486f74775c1e44c6872fedb96cd4ceb940a700572ecbde04207d5f5204dc81cda92186b19f4c6c8cd1baaac5574bf9a0375b5b6755a8b3389898c4e6c438997fc85402183cd36bb76bda73b560a7b7500809c44cb6b3fb2b12cc117008790b821a15ebe301b405825b8102814adc578df7e5fbd1c338a2dc16812b2ae930e907697a2d18d008e6d5605f55f17f8fc2dafe0d7a4e06045680",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOctober.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/October.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=410de9758a6ba59f549adae3dcb86a54c43d4ca713fcca98f6c16e5229a0a16ad9bfff7a4fad70ca88ed1b511f2650b209c746f7f212f91b2cbcd6968a80dce0b0e9791deb7c472063df38d62259f978f33f4102664c2603875b848c0f92b2fc374df1ab3e1f14079c31c15d3c48b44d6eefbca22134631ca2e12c20f4cd0ececa1472e4a4487bdb7f208e3a186888ac524a0be753e2b5aecf6e37e7083003d4a14f42229d04533b35f07631a09c61a0c3a70a6ae31c299c73b51105ad894883cf0d5bee734509858af587f374e60415eec5e7722d5d657de4df054fe039f8c1ff9b489ef6fb12a57fac23e6c90598bf65d31298db49da0f40b578a788140315"
        },
        {
            "id": 12,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 13,
            "title": "September",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSeptember.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/September.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0762bcec1b24cce9f491ae3454419a85b90776ae238161d791acac1cd8405c7f108a3926b88097c8ff9c97133b5384eb5157b68d086b540aa4b01e026c84d62bc52b5fba06e11a2cb48d2db2c36dedfa494f8953d25dc2ef344051f7d586c243c9838d60a8ae475cca3b904a5f3b381e5888508fb27630d404342411d2e56ab8c4739c4db20e8277f770e4827277eb7501edcb1bda7468a7a8bcb93b3c8f19d3fe5abc22cb80e6dd4e00b869080fcfa1c545679a0be654aeafde8b55f3e6de57a81f7434861b477f3b5decfafc707265e134394d332c7269c5cf2343b3c40bd10671b998cf63c5c7cb3a7183cf4143850e59ebd6953c22851fe1ae7749536f28",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSeptember.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/September.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6a1cc0256524284fc5cd53304e28d57348d99cbb4f1725aad92ddbafd09a2c806b01c22b9fd407b2f8a634f292dd56ff486e72810c27bd191df5696118faed58d848381e73ae0b6965f8faa60caaddc8d6f9584e414557ebd615a51dc1e08893ca5a44600b9ba548acf4b769c839ff65ac7733b204765c9804428824355c27d630f7240176edd92ff91b823b9c75b1c03e3ba4f2b033aeb958c738b10aba35236e4b19b0fff7bbc8f79b6cab4c8ec65e6382920abe8801094f6ee83eb99ba96bf1c87a26e0a55df3c6701c622027721021cb1a547510b0ddccfe49f68d4fbcfa2a981de72b214b5051b5e8c281ca7d785ab47a6f961b8f300e789cf5fec56351"
        }
    ],
    "color": [
        {
            "id": 1,
            "title": "Black",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlack.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Black.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0aef161f336a9a8b5b957ecf527c5908777050644f0b7a372bd8f1597e2c89bbc97155b29a85ac6048998889be0d7dc3eba683ca0507ed85b5b0aa91f765ac4194f7016d2e033b7a00bcaab0def7d28c0411dac09d580712d451646f958256c19cb3db04b9303341b32b6d2496912b8f0c52c46bba06295b14ea26e7c93223be3f39723f841c9f23282ac1afcb7b7936dd4a6251de43a42f625e3109f3d6211893b629ae72c338f265f4faa5ece5e1175c1323c34a25961ce071062fdb5f115be6f43d9236119c423ae3c0e119dbe8e9549909e370b8347e48a588c8c7b7ebf6930fffed0169a4d9857e8d828c6be9eb3248c1037c61dbfa7be19c8107f00d87",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlack.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Black.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=900af3aa536d6a10555f9f4786ee5b47f753d6ec65b2ba66db4abc18f8da9f1fad89e8747eb95279194cf0f2457496ef9c69fe4dc85f73edb977e6351cbd62c41f764fb34dbdbf5e195be703d07dfbb8d2a3e8b901e050273c51a891dea8fd597da8a7f4c306934bb5dbfcac40c42441e72d1ad223573d9d7171eaf7c482760581f353f7a6e7d730243917eb237fea4861660b651e106caf8427df45caa03fb4581942a0807b819d3b3039febaee4c321f3c65daeceedf342209fe9bc480543ab72fb4806b63be005351930ff655a510098f3a312bde7402d7907cd11de07822ab6c8425cf914ddf82bc8ffcf99afa83ebc769a52beb07f53af111947ab5377d"
        },
        {
            "id": 2,
            "title": "Blue",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlue.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blue.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=95cec0d1aa7305ef1714a61ad1cf18ee2d05081f186bfc23f8ba5a6ff920fa6b3e1a1b4476e4e8ce827bf03ed4387521e51c2df12a90487c40b556816baf88a491b89b9121d6b246c394bed5f3fe8200c95e4d093e455b14b57d3fbd404cbb6d14da39a6bc5bdae4a31c4d00b0d520bdb136b408b1c34c0e2d235c9b6cc5095864a4aa84c1fa842b4d5a771d774c19b6570f4774ed845e94aa5952581c9c6014fdbe75e115f37bb3d2dfc4407ab2dba26ed20b1f40f6937a38f89ea64eaabb976b4db760f8cb5a3abbace6d5b31e8441fbde58ce0c8633ecc79dd35a2c3506f0b9938abdd6a811a77e26d0a1faf379ff5bab7e8eb1e3d35d57a020ae90687e07",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlue.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blue.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3530234e402fd313163b711900ddfb8e2054554855ddf1b3e8d82343156355b03bcf645c996ff42c6bda8aae9512288bf589714897099214733d471615d5d0a48b9f9fcdceb9ffa0cceea9bcaa3b924a70882fe977a13f97475d8e5a7da574b9fe3270d2ca94b70a68578570e4ba20e0dd90f3e2f05778fb93e89f17de0b160f05c00c2b07bb80d1e609adad6dbe294a961449b9d033bd345af10df5c4c268c31e92db3a2ba75c6eff7626652dae56a823f5e49e4cd3fd7678daf5630f33824591c0407e30926ff7809e4cc35d2d2ba2cd3c8978ffba2f3c9c905d387c1059416f505be46fcbfecc54b1dd0c749d5f86f2b4c2eb7b4f3dd7abd7c14357f430a6"
        },
        {
            "id": 3,
            "title": "Brown",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBrown.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Brown.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7103561c36d95c858624f64e91cf3f5aebd3f18bfed553592a9156ee2d815955b054ab0161fa9c7f97be1195e92c0a6e207c3605753d57c3e8aa31f83ddd1997e1b12011fde465ea03eea014f03988c592486aa05c0ea7cf151bd4f0499d4dfcfa88c58de23d8fec106e66bcf27ff5212030594548e7159937eb3258b90e2666b49a2c185554a60504a36607e9a72b41cb748825d4492039f18b679143828c2ee4843e05be2fca91e64479ef4381d507af3902ce3290773bc7238b85804bc57cd382089c0630f2695a6e87ca0af43cee59795a5956af02be04bb6fab1a4dee133066f245cde9440c98772ac2ef9d907a02fd443ca1f3c699a90ee092ede48d04",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBrown.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Brown.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=90888a6fc608722695b120bf1a2f82cab7bd20f119ebec3c1412dfa15521d87a42fb04fad554be37bb0fdf26cd1bbf8a9c0ce8e8b2fb127c78c57b3d29f2e09f1bcacd951754b3583bbfd1d8be02e5acfe579a697138b04d668268d7bd208890f0b634ebfec57b2cf61fe2605130d3ba23b33af6ffb42e6598e015ccfc6f8819b2e1181b483964bd6d0e93aebb193eec7c16aac8224d5249d33d23d8571e236e0558837a789c49fb6c40d4219f5a6f89197d8c83f4665f00071b061408d1eca3c3de67a7696229753d6a7faf1f4f5feb3ba8a1c2be14e3bf17855d563e9f51b7b24cc6b365499f6ac36f24d73ed9218f501c40f5d162da33fcf4bcf557f402fd"
        },
        {
            "id": 4,
            "title": "Dark",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDark.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Dark.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=020c8f87cad467f0279907899b4f6a361a87019c33d260ee3dcf0c386b4e89f3f9610f582139456996766324e2a42b33e0aecbd8d0ffc3e304ca4a5234b96eb484cb846e5e16f55679434349c500ba3c2324fc23955e72f1737025c2463ae4632b85f5210fff57a3419c3d4e5a5e2e45297403af040c03870dd3dc8fc8614b6af67cef0e16f12c57c8a34b0284e54130fd7994358069ec41e8934dbbf3eb0af62a6becd5c682d1acd3dbd10a458f0d3808c390655cd343b703d2eaf6c3c915d6d52ffc3ad08fec9af4423ef582265dcc9b5dc4ceaad2921f9f2be91c22516ec2ed62bf009b25e4696fa3271b856e2ff09088ebf34b0de088a7b6d1e6958f72ed",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDark.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Dark.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5b06a12f6ed821ef0cdbf357e6824c84d4818a32c1dc1c6cabd95f030de846d9cfaeded6e64f747994469ef1c44a5b374f7300a99ae40506179f8afd4ed63d9d841eb157320b73184e9a8c902fb77830d94b3dea7c2b43ccebcfecfc8777b5babf5ac8af49107f8f1d2f43c51045e6ada087d0cc1f987aab9d7f142349b2dbe57de940d646e7b1e053d355cbcf975fb4cf155d86a0f76bfd9727169b766cc945a4cb67d79b957f6373ec0855e1b505609d48305ba426a09a326e35ebadf13aac64ddd60d7d93ce42f37182ddf60df38906406bdc728a30ffe5d16c09eb983a9df06a15583d93c33a8f6c89c080718b0bb4c15b9f29859e65522f8f91b5bde77c"
        },
        {
            "id": 5,
            "title": "Gray",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGray.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Gray.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=865a58da681aa75ce236de9d2f12d59cdd4d6a27b46bd2f391e8a71cb4a0930ffc12c1b467e7f58f18cb064ef6aa887d6f1ffd613f785b0e302f300510a51dcb4aee672fb728811e3956ff5f22fb5a0f99d503edabc327cddef684db550408889e0619d96c0132b9149e4b7f94bfcc030bc193538c6c5e47d6250e423300c43df1207538895c6d2e44001a00f6d77c2b9bcafc868c9c5eb84d7b178f191848f00bca1489e425da0e598a28bf43cfe10db1d354c73a1ddb84912df50b15162054fb45ae95daa689c744156415384b28bea0f5132688a65bdaafc9666280227265e250dd4c82e9c55e9a4aa50ba7aa3fd51905d6b77a89187eefd43188e8e09a54",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGray.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Gray.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4063744a2296a6bc7c34c8720c449764adc2ff89b90122ffe01865fe1c316bbacdfd1eda51f5c07eb2896db095b36ab59d097b19b16f7d31da36e6befc2236e78101ad563cf53b2d90ab20829316acc873fda0e37cbf76e4fb6d693eaa96f2c9bf4d07e78b95942431b5533cd8c63febb83d6198af6a168811f37f3578c3022699a6759d241502ec3879efe553cfe834eecd9ad34cc8fd7def5e21f7f03c241856b5064e3a9650844781a565d0e8e2084643037230704b609febdfe958bb2273996e3e7f041fcef9d824795425464883b1cf4bb1141ba46fd2d7566f6389dd2f27c9bdc0f877930d17295c30841ecf89b26976155affa51d80251a702dabe2e6"
        },
        {
            "id": 6,
            "title": "Green",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGreen.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Green.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8cc5fce9d7379b24139ffd7fecf7705ae40c4aaf4dc845cd2d9867584a5b3efb222ceac1ec8c65d82ced9fd45cf0520a0a50dbc0cf671bf21755283adb557308029bbea8c24e9d9a034533ea6b397e096446fe51ec4ffdd2d8c9ec6c2eea55dbceb189581b1e94451e44b15aedbbbb2d7518b93f1c9bd2436c0231be95ec02ff0b37a33c31a9c306ff02eb8a7787b45d9054875c14fe62116fa95bf4c3a79e91ae1b3710a688204ca1cf2fca992e0118965a803542f55ab29a6204af92ca312ada262b20135a90965faafede3159da8b440316ff113fd383bdbb6bb6f3df82958230f53e06575f2600e491283ff3dbadf9e2b9c1b4ad8e29bfc6cc111756f11b",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGreen.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Green.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=72f42f8fbfbfba521896fbbcfb57e754fa7811a972be5d4aa65d6ed2e5bdfcd46e7b822d89396d8ba13f23efa6cc44306b48ba04421a0ea1482288e968ceef71ebd9b59bbce8177c6865cdc48cf44abb3b70ccefa0aceb08b86d6cdb61692f9e35bea1469931e810716d209ac91b0bc94cb564d6854fb90ad4e6433ed6cda83bc767a91133c227d7f868a558d548c9dff3581971045575d5fb19842a2a491bc849f26e954c39817767f9797829c61b89930bdec763ba09ef940a66cba2edb3ffa8b5492dbdb38e68cd4a3b4452e3c0e4abf645440105561358d26e94b6043d4cf39acecbfeee74ac3786b548996e087ec7303325deefb5733a6b6fbaf6d0f51f"
        },
        {
            "id": 7,
            "title": "Light",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLight.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Light.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=89c609db5fd1281ea1c83d9a7be2213466d90a1547ae07ad6304b6ad34efe32129a14445c0843367374475a7f92d577855fab71866e6036d97e98de2114ebdde07db757288d2c83cf6230fdf5ce93435f02e512b3c6a2135151be9bc1e753bae3fd53f571bc6fd8b2a810f427136860c17a04b18f9a5fe7dd0419c12052c1196bf6f9ea680e12f194b791993e705b334bfd736280eba09b88516ccc18ccf8b70751dce32d6766fb038647a5f849eb6daa48645e603154f0053343afa192d32398fb8e77b1e43151bef1c408dc010c2bbddbc629d616f4f87e8f324cc5d1c86017397ff2083202e16e1e04118c8bc4c0aac0349e1abbc3ae8affe79a4929aa9f7",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLight.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Light.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9f773c1bb44491ba22d8a1d23f4321ee9246763b729da13157bcd84f4380bf7c554e21c6c84b3384abb41c62930aacec7dd926376299016243028613582a8869c6b36b651863127d850c73fee97e1feda31487e1be9b00032270be7481cbcebb5c261a5c981e8572b6ac292f7d5fdddc50df35a6a7f9f58863ac04fde12832ad73dd85d4b693955e128bf5f247aa2251379731a6ffbe2bba49d991e7b4b2bd09d6f44c24ee86b3b079b61e0f2867e9ee7609a6aa36bfcbc9b0b266e3987560422ad761586c2515445bd70b5d6513107d86b8b125421239b801518e30a318fe6d1234c8a0eb321d972fb7df19e355aca8cdb682de99bf128f34efcf0d6062e81e"
        },
        {
            "id": 8,
            "title": "Orange",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOrange.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Orange.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2b5654c50d3b1a6b9d6d8864e75f1ba69447d6a5f5e1a0ce73966bad2bdf15242131b5e2929f6f3c273bd33424546ce86a301b7e7e20502f5129c1f759a94f1f390649054bfe8fea5229296527db0dc15247fd250a88fcb1979314b2055d713a2a465beb786046a7d3fbd701059a40cd0c266eb7f19b55dca4ee0587a41817cc7b2a10c40fd91b65796548c5d24bbae9c6f450d966a6925c69c3a05fc72b3371d9de3a8413750b07c0437b2419be7482c0315fce1f209d11f42b13ce4aad2c0260c1a8050ce425f38d0df59df006e80fbb5950a5f9993515440087333d75db04a0c8acd38233a49250c571f0783c82539583d782c83cd994fe2a2d033e7d624d",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FOrange.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Orange.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=686dd69aa940bb58275191ad583da66531ef4247fb7c1a66015f6a7f95cf357c20692e05839d885a9216818b7d630f953ab06ec285f0773703e6fe46b1d7f78e3b89b28334730c32d9d291215f8e36ecbed12f60ca5957f274b137ad8c965ee3fd0ef192c647494500d17d27cad3f6936b684a5d1697fb88c73507bfb09e8ec8ed6b4136f6d6bb5fbe003d19b7cf3fed23038fee864d4123c43710af16a589d265838c07431074bae7acee366b16da78639cc636da93bfdf245a26c9a6eb8745dd33707cf167a6c9c2729aed9e7b9a4467d5082a5016566d3bd22db31ab375850f99c5943e9162913d144d59400fc781f7a96a3a5e8e68a444ab8fb436a71e29"
        },
        {
            "id": 9,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 10,
            "title": "Pink",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FPink.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Pink.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=186a3efe76bd8273e0836c1a118ec2ec579cff90be88ec90a75b54dc33823f2d2f904af455fb283d2d5ea4b77eb7a0552e7f974cbe4321aacf5dd8997850288aa90f92b44138966d94e5775a34ef34e9d2b0fd6b5ea5065af94fb9a8e9786504bce8330aa40413a117caad3c51dfca397db8c45d5d68dfb35301b1330104b66e2deeedc98f1a2c13350f904308213349fbab1ce4bf756f3f553aca88bf71bff506960fa1c7206f62dfa58e0b51cac203706a0e4526bc496087cd079fd5132ad188f3da9da27c18e57993f5df3575ceae311eaa688bdc819bb952639302afe6796092f7e8f181c78fc9eb168772ecc2cdf9641689c871ecee98689380486c100a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FPink.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Pink.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=891f41bf83d09cba4a54d2d816cdcb3e3545c56b6ec051733c115ada346da72fe59ede8666df4b2523e3dd4c1328f6a9faafab830b65efb7a6b0822c1eb63ebb48e2e2040c1237d5d3025557b23abd6ed6b9793b9f9731bb7417a2ee94e02bfb9cd6e303ab0e4d469a113511b11df24949ec37396dcdc254e2bc86e445a5dde74d99e608a283b423a09ebf95939bdf2086a19ffe7d0058193a7c78f4159abaeb535d0cdea4e7e85b6bf9d838540587be6ef5941640cd63f5d31c7eb2097f9090ab59b3a1f3c7959d059b136230700465ba10d5e48d5e2dcb0192e604088c1f35a2cc2702158b67a45b8c34e92f7d8a653878200b4f3081aa1576bb530574861a"
        },
        {
            "id": 11,
            "title": "Red",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRed.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Red.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=52b2a0e80dd147d102f55583edffc8e3d3b1a3b92b23b5cee3ad9df86a89b3445284d2330d7ebb9b7af6ce7e5538346a786aab636320a266633378da5cfa4fccb76c01bb995cc34cd55d962404676759e49f38d5da9bc761e0a197a6f025447a7f3a64a857d689a11dca853ac20d183da934c421d13b8db923a30d8dde5239b67d0b513d936c3147bcc292723e9267215e4704ca27a5f77227befa1f171c73fc92a56bd55599fae287771c1fa5e3cdc731cbd2100c5649711f65e9b4fb3605f14b4fc291239352901f112b5db9914bc09e1eba4f5a5ab4e0594bb42459fc5444754f6c7fd502ecb7a38df24f0e049c75161bbffb418654a534e0ced361a113c1",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRed.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Red.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a44ef316bed46c1e4ba6bd15dab1764207359ce5a5b5ab278ac65e83d36b7815b1b6915f228937891dcda0c981d800c95435a41e96b25343e9082040d52e5fd9f9ef9b6564486adea5712cf2c32d2992a8922df882700c4174d3df44c24264c2cf5eff4319b0a7571531d4314c2ac3c86eaa606b1258cd8729f493442cf4e49f26825f9e03f2603d2bdce5b63aac9c0f77d965814e02e4b51e26c55fe01affe88db78234115d7ce4932c59e7b75ffc1234b7f6e0ef3c82aaa456c6fec387fb7334ca75a15f3a5a985b3070c8128011e727cc924c815e057f4d5bd4385c6a716b5388781499b44d7a4e2b222b7397f5989a27799da8ea56efa83692d88cff0527"
        },
        {
            "id": 12,
            "title": "Violet",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FViolet.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Violet.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=66fdc37e397a4084d1f0facb8d2b48dec97374f473b56f50738206010e7e43b457eb9789583166ac16929604e3cd8615378516efa5cce559f5107f5084d4815482bc9f97206122b5472d3e68a6fa5015957cb198f6b3a627e89c454d03fc24579697c76524ad87e92ee7b88c7bf2808d4a479f88b9178c50df750df07fb93ab5aa99dafaae4fa85d2ccabb48bb0b0957dc333d457381ae1fe17951f91ed090532c5d1d17782941cc246db3b3f3195f89d1af840a4d93996246c6ae976a28e7d9412dd56a9dba34b76135c6188f40a53fdb88c6cbe3a4d8b59b0e655071936bf9bef0e005a22b375f706754d3891e449fc93de5e95f858a495e5818aee0933277",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FViolet.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Violet.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2ec3e11f8d0cba8f2c8d65cf3ed0a4031c624845e11932243633dbe24b56f2966623b30e400aa3fb6a187d243ae866f73f32d4bc0dc9fa41b96ae354debc71469353168891c29df74edb658ce0a87ba631919dbf7f047ca027ddbeb1b86c4c6c97e6b0424d53ac75e8978a6f79817771416a6a9e617ec4477e6500e192f2921ca7e13dbfd89523e5f7a2906b6fca2a0a2e78fef325beea5adaaf4fd79b37e5a75d50a27084f9ef9796d357f63df550b8d2c7f593c143ca8da52e302020335dc91255280a3a7d3780877b9bfe1bd59355468d11209d4ee6294cea42d6c2caeddfabed8961fda9810f3721b80a23e2c0353f7eadc6d37cf6b852437b8e47207494"
        },
        {
            "id": 13,
            "title": "White",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWhite.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/White.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=28a144ccd5ee515672c705280ea4d0a91f3c2d0c668207d8dcc40f85273bafad4504a0df60ba5dd635ea1ef7b37cfaa8ffa4921a7b8f2aa34cf67bc6968ad316a19832603098212cb612e2b7ea38bc95b377e9aa7a45a05cadece17d4c953da20f2af78994a8f5616c5f65a5ee2e7765773165315754cadb4691af3fce12e92d50e6e31e0c08edd3ea67f9a1a60d46167adf51172e009b139da67dcff997dc990333c64d3f0d1db76a7f848dd62d4dfb9fad67832fec03efbf4c7fb37094acfa23ab7faec79e4fce3e3a3e37c032703427d33cab64912761c50fee3ae29e79d904a71f8ffc836599c0bb4fe6121e88599145d134d420c2fa7860b0c35eeffe9b",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWhite.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/White.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a38f42712dc5fb3116d4ca6d1beaa609d46aa1fbe6ed3b57faff6fa054bd0a7495706b6de8b9c1f979e83728430c7351db7fc69aaf7e62f5dfc4a7e2bbc4f8ab0f9750bcb87a158f9fb1a0832b9bb849d1f0e9bb11785730646dba404cda29156babe55c6889a8dea4395260cc65d96564678f67f37f054244abdffedbff2ef8a5693c5a923bd09ff966fd99c712f8cc145e3d637b5b3941337377dffda209e48a9a14ef3cd8da8bfb6d898275d6220e7f39c4d0e733cbc52f5c4b74e625bcfc653d735a859e249e1848ee4fb046e76de1f3bdc65c688b4567c439fff1f8ead615f9ec66e685706422d93fa0d332d3b1732deaa30b539781ad249b45f166640d"
        },
        {
            "id": 14,
            "title": "Yellow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYellow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yellow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=90d0df7c685f6b92d0dcaff9ce7c87b830d2ada43dc7cb5c7e42b9903957b089b449db9d89ec71ebcde5e56102285da7df3089c02d3c0922ccff8f37621c6c1692c1507518aacb6a1bebc7438163098644fb04d9f78d79db462d5744d87568c8ad3bc1f2447c2dd2aa75f60a55df44d17dc15a9c39556063baa1798d64abdfa19854cf7facb050f2816571f859c3ae1a05163474edaaa7c0fd0bb77ef275bdac8f492e7a28414de821ec3772079169c3e795a867ac4b06544ffc592d545b1242153b265e3b089a45745385f588218005cb66e00ad9ba59d0eb437e6b531273a8388c3531c9b9495661a5fab09281beca357ca1440ce00373c89e860580a54f54",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYellow.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yellow.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=38dc8ef8bd544bfc65bc2cfccdb144de56362500bdf91585b6804d8a2a5eae6fc53cc02888848dd636516e66cfa5d2fbd769c9fb8a111594b9097cb22eb0f80694c15754fe8d398b160bdacf3bb8dc9082cade9711fcb00cc5d2c5762485e342d626435c2d9723ced586adc3fc3be89d84174715dadbeb63a5587282dd52bbe9936fac921abcf17a65267757d7d3dd9f00888064f5dfb65a7ea0bc0f3ac805e8b3df04ba0f1fe216a02781d3efadb00a8abe4818d63a35e13c96bbe94c7eade15c7b7cb143d1300d197431ef22cd6d571436dadd254a482dd2cd55f445846b873fcc10b751fe17f10f0ffa950e7b77887fc78df7cc3e105d97fa4b86ea514785"
        }
    ],
    "days": [
        {
            "id": 1,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 2,
            "title": "Saturday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSaturday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Saturday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=366a6e6c4a4aaa467a28bacff882cb7aa241e10a99f7eb254af47bd64e73101d10ed3dd39459b0776520ea765bdc7fc7db0b3697bf54109372158bac44505f10cc314c48a074fd0d27a3f1bcd38580246ed4874995d10c64e93be283190516c8664a59cd0a93238c4323072764a304adb31165b03e3750d81571745015994d9fc9e7d4e59628c942c8dee9c4f32de575914fd5e4eac2346db5f8f14ece168c9b7292cf05898cc596defeae50b2970235f605f10e6a8f3c5a273b31bd34e1167824d00c1ee71929051d6b9de8a5dd95663d79670cb3081f591876a830634edeeadcdb643258536b7d908b3d9ab5171ed65e8d90f81aebf5854c02fd43818a228f",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSaturday.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Saturday.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7dd3a96163631d8c8257e75d4abae0a35358e8d59c42bdeac1a1e72c5c866ce2ee06d5e1c191561cbdd38a9c14212730dcc687752a3a87a0924b91e24e938e44457debc6db3e4ccf3b82288f772dc562bd4430477c38fd50c610a1cc9501504b26d4fad7544e41c85c869d43ab6144793ff072bf78de4f61ebd2dea8901625a92f08d61331a66ab8728e304b0af21566132cccb808f3299157ccf0c1dbdb6a10f588b2f26b49070cf2a3e85bbc35a0f1fed4a72c1a3513c57125ee2d98b5edbc5089e69394371427a7d37c337febac7670c069ee1a9021577391d7828ac02cd988f3a832fb8df9ed393a5e7aa9dba464b34821a7d18d99859f9fac9e3d917417"
        },
        {
            "id": 3,
            "title": "Thursday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThursday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thursday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7396438cbf4bc57a060495176996b3ce219128a8d61362eba69489967660e82de584395b42b3aa3286268313d862e5c5e1a45e6b1e71461e4f2231e851b17c4a5358a671e7731ba45fd9c575b37ba7808665a6cef8d61165e22625942dd96a2a8115f17de6acccf4fdaf11ac452da6f7d5bf00e42abbe781c9b197269cb2d19595a99b5858e1ff818985e7871e5e11ea6ba02b459d243ae4d75cce63b8f6a7032bcb3fcc27bd2b91aff55c0194fdf79a4870ac90c128fdd50e02b445b588a2fc15d9b16f4856dd45ff6a4c1de519bc1f7884587d46c746a2175a7efc14bcdb459f2ed7092ceb5ba905c6877db3111b4372ec5230d54975fbb860d7a2a9fbefbe",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThursday.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thursday.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=77fd18e72ec03b8d7911d12b8a248ae01d74af1ce6823e08a94b29f12c2dd5da9d5228b93540ef0c2f9ab148a45f367e2ef39e602aae7528c2defa6a469f0f69765c6b07e66d6f7af78ad92fb445cef19760abec634bf9eec0e71e6c985ad2e4a16862f00bf19271f33818163e1e80bb2da6e7be8e4d65ae61f643282beec40fa57737ac94cc743a54e13ec740de6ad9dddccc8e8f632b11970d3d14502238246d48e6c4d57a513a8e2a2526b58a0823789544322786a60ecd28a92295ca74105193b01a53c738c06292a0b0d9a6b44abad91ae465a6c2619ddaebac21a05c6cd2adac5ab468baa88ddc90d6ce141b26feaed4efd01f9b2c282e89da7fa762f4"
        },
        {
            "id": 4,
            "title": "Today",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FToday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Today.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5c8f5e2975b6ef5c468778b306a2459bb9897e4e80341d6e0546b05085664d2fd7b46c936e93c15fe7c98cb511cb9f609ffc64f268178d3439ea6cf7ba8aa4c80a81d19ca85679aa06b649c2e46d8e1c6a4bb00ecdac8cbf73a6a8e8dc63fd816dc2076bf877517da709db54e50950ccf087796deb4e2b81e26524071f69ade09842766980a171f67804ca0b82e5dbd9e07cd01b0eed0bafb69d4252078bc90f1951f0596106d33dfa388900de8d2a837bc9669074815909601b35c2901fcafc342c92aad65e5e6f8bf52d8be375b9d5e9fc3fc28b02ca6f16228eacc0c9481e498ba8381d6a0d676367aa2ee4f0a0395cfe62b12b830c303a336157a095d220",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FToday.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Today.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=783a2676ab9d706c52e5599ef9cad75bfd75fe6f8af944259ea86297933954546fc5581783605c3f2835f6bd937e042a3aceef9f4018fd0051d1bbac31220417882e3b05fbffae0ee95d73875bd6ee9dd105a96f9b5556edcfe8b5e700dfeb6b8f5c7deda2d16b6864cf67c80b8d9141dea9070aa1e4a8f22b331a4fa0dc7967f215825051cd19cc7551557197c9cc1e0c5281ed23e4d72efcab4fb6abf4c7f0f0cce933fb12c118dd87e45ab4a37202883041477909ff69628c95b1b4570cdcbc55cb59da23f5078049b00571e82b64e856638b2dfbc735685ffd3bd8626a43230770875a19ecd140985b360e2eb0b7debba74373b8c75b152ec673ada88ebe"
        },
        {
            "id": 5,
            "title": "Yesterday",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYesterday.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yesterday.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=620222b3222529e2340c818d61c5b13d7dbfb144a58febec577ef0b7ffac4db3541d5a5e39cf85ef3e83f24c5cb8c61be6d4c39f7594e34423a403ec8af685ea7a5984ebeaec87ab12ad786bb136e201f1a94ff711325d726197637a52264a4aa41e53406b30bc8e34aae8a722f79daeecda78be03c1d981d61cf02271fecbfda50b0408ab43701dd8127ec529f3967257e1eee2bf29ffd2549fac8514c500f2f4a1bd01a4447a9c91f7bc767fa7d462b1ccc44d91a5f1d0968ad3f562b14eac907a95f2d970e8f2208ecfdd5a93192077cb26e045f5680ea70be09c2dbb4cd3250726cc0ac2a6285297285cc11c7cf2ddceae01fc8491cde2be441d60b7c0ec",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYesterday.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yesterday.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=451228e4145887a09951da36627734dab1c0a369e582343b9614fb1e3783219627e6fd07959c60122fef60714d8f7e88530d38d2079b62fe8e93bff02c0c6282abf47ba2f16574bbdbf988412b6411a127a0f2c91669bae0ad3b85f609465e0dfd8c9f67984ec530c1709b35231055204d32faca43f1f0e70cfc380b59fc65f75fb3e9f6dd8d6dfb92aaf9f2ae2165f40d8e2308e97e480ceebf25fe14d8f2468652c89e9dd22aaa3f074294b69cc43c6e5b370c1b588c5694ffb77bc95f44b58dd34e6d2bba2577470bc8ee39fcf3c8cdad77d35bc0e130c0887828688590a2f74c46e459d899498cbc9c29fb433768a5b84c030c22b28dba37f2a46761ec07"
        }
    ],
    "drink": [
        {
            "id": 1,
            "title": "Beer",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBeer.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Beer.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1800141a27fb1bc6169f3ebf8baf4a587a9cb1e0c1f7d5594b1e54e23ff4447278ded7201db858148e3144e2a7009e7817e90c65f212b9a2639e20f85dd6490c87dfa0228ed77b035b56aa79ab2feb0ee8c06f80545d6ac8d3da250407ed131e613eae45b819d0348e3c53298d2aa2441c215b8067cb22ce8d820da2731b43969d9d697e0f40afe24ef0014e6c35b909d9825b43e06bc776eab28d352dcd120eff035bf6b7708e11599f3bca17b6e05195049f95510f88f9e3c0b59e7b8ccc59afe75f27d0ca510af1b4b383a892ffaacbed61b4d43c833c82cfafd57d3ffe6002430ea171c93980654411d52a87f8b9f7b2844722699ca6e1b0828b5ba1d427",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBeer.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Beer.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2b5942697b84e6d06ef35e115b2558b11eb759cc97073db5fa55f30c2323dfe99dc236609b6185bde246a3f3ab799485ac589842f6fd3afef9d0a9a422280cc5f0651a6142aaa8b3902b15e9fdb74f8300bbe905663159f14d16bba00f4b41eff2a1074bb4731889333e881bc5dedffd0bc86ddf009490dfc93b2b33598763d9e2cc8b594f5892b01d6c21a9ca17d1b65c96f0355430824a1c7c2eda3ace3457dee5d1303ccfe13216e214a9f1664cfc38532fa70faeb00dd464317a3f73625a4bd3cb763da1fdd443f6a2ac12080ec268a7fb8a1c73d6ec4add99464b62bdd78d1b7bcacf90627f5dae683c9f3562e15426c894ef98644d0fc32ebfd41bb80d"
        },
        {
            "id": 2,
            "title": "Coffee",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCoffee.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Coffee.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=01673072d23b5344db3a857fbf97f5e319a1de90ae2d240e6b4f8e5bd43a2cd1cff5eb7a1b96f87df088253b9441e58bd6a34a53f9c56d5d5637e30513b70797621c12b2831b9de3786461e7687946c4fef8c5de3fbd0cb553e07fcd33e2ec1e2374048070c19a000219ec21c53b27b407aba2f82ec60f77e6590d895221218eddd10a1d37f8a4abd8268a312f50b41f6b5334f485eac5ca6598296e972fcbd3df2d23bf1fcfdb107fdd588187aec32bbd8b4259d7a2041368b76913897fa5913fc8ca3927af29df60707a57e578f9cd9ddcad285dc4597466281a2bc60dba88aa40466f43a4483bcbcfbae2fd9d8431c4d5db1acd8252266095515f0ac780de",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCoffee.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Coffee.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=43072ff5467006be800db222f3a7aadef898d3a1ab25e1caeebd8a9b357fa7251682db6b56d884e49c7c9d4b5d8fa9429bbc751e20346e01549a46e6550a15c0e8c8e7a353da07e7e82714f099777340323212e20cff4ddd53170c9590f3a9951dee85954f3f12cc56bf1c6363f2a716ec8637c48d7a5d50a5e1edbc20ff899d01d914873a7636c252569084890c80e69147a1f96f676162de05a74c4084a529ac2a601950d8a24ef0c2b7c8e5cd510566aaa7f9232f04216f24fa3f5e138e55cd7140e79a7cd773f35867ce6c4ed6a0def1cad82fd13b85a4558d89d3854c0511dcc2ca77d108b18ea046f5a7457d5e209aaf4333209c4cca8df0cf65614dd5"
        },
        {
            "id": 3,
            "title": "Cold",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCold.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cold.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9af788603b78e0a495a335ca2eea6e353842402dbbeffba8b8eda573da346c1a56fd1388605990db8ecf374d16bd75c6dc881918689483c2aed225158f2afe714f7852a981716fc6a7e2bb1f579c7289d9c5cd641973eca7e5b061350ae2602f08cdf04f1b7bf0eceaeb613f1d60459a8abfbfe5d00cdb4223d14926f3c315f6b5823c3c67eab977fadbf98733878508eb223fb845217d6fcc4bbc164c0803c3bae77ef4a6358a59ea014be38708e62eef631265d49ca32bdf443d2b11fd4f64ba0492ad0a050c6a848333fbd0dfda074588ee467c3f254b0447e674294a27775c79d7a902135a0fdf867457492efdce4b4672e26fcf5905a0abb74b2ad5f915",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCold.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cold.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=61c2cd2aaf0d5cc79aaa3b2dd40fa5f3014ce0471be4091d501921e2ee476ed8a48378bac0f7e0ca18dac01128d277cdf241e5ff5036db55246f758173fe0c9399f31711a31aab8bc8ea1fe16fd06082a3557ad3cd5cade1ec316a822b1b8f2ebb6b69a9f0627ff4fcc69dbac8fc063cc26bc5ebd4ef11ee4d6797e29682892c948d39287d7bc5b2812ea33be26579c3ead3d81cbf195ae821da22027525a20ba3a3a72e0b8c5ed4860993c49138580508dae2d4d05fdf60b4082e690203c02d5ccf5c8208c2ba083b652d53094763e014b62e13a01a08a3e7ba539b42b3e71443ebb64fe50f50b2ff2ac68df344c320f701edf8d8caa84e06bdfcbbef0514b7"
        },
        {
            "id": 4,
            "title": "Hot",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHot.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hot.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3810415eb36d4be9eccd53f2916f573ad969ca32ace9e3ecc5dae90b222835d46a5341b6d1abda30ad70ec976dc757e13c64ecee910119a27da1bef92f2714b666ef4535a13412164807ccf9977b94700c4922bfc24f008485e133899dc144ada26436ae3068717f33b86d74ef6a17026b7815dc938679775e983639662e463a4065de9759abae85dd5996847119eb1272eebd7568c7ad3925e85eedce2aa24c2d9463caa9e60fed64efad3ff1861387df4b061b63d33281224971a3431dbb52f28168a686e4b38d3c5f0f9ad422d4dee1de13f96bc752d055f2ba010b40b9b378aa85888fb68f29c811070dbc5bf581ae72c4a7c1dab7e008ead3eddbaf3ffa",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHot.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hot.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7957f5a7e0194a7a58c4eac981228f940cbed77741048f0341f8f8e2afd4cd1b81f72ee9e23c9283304f66e0044af71c7dc2eab88459bc5f39984563f2f09b4c8796cf9d019a6dae7d78af054e892a7038c28c2eb2026eff06c3661c800e3f0f790d79f64466cfa16a77490222d29b40c1791b69144b95a54dec9378c6f822529d79fc8bfc6f413adb161abc27f92ba87de0af2f0c4ae76d5a7e9a1386e223dcefff5e9babaf7f4bd7dd13a8a3f53ce72fd8097a15d7fe8656d77f4abe6a72d6b156dc97ee5e6dac90cdd712fa1635b86de3ec31b11b38b43926be791850954716ef45f6087c1b7c5eedff4027cd2f408ac33fde81e7725f37c4d331dee7740b"
        },
        {
            "id": 5,
            "title": "Juice",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuice.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Juice.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=67aa7826ae960b8114202a559432c3f2119750e438b1101d8fba72bf741bfabb086c68b58803785f19a65f645d7ba7c08a82d5e3637086334f60a2982f6828167147687518d753b4984e139ed9f41b808884afd8309a3d1cd7735e876d3c36995fab272a6ab401ea1dfbcdabe45c0bd4f1e2ef54c16339b73a5a0a56c7835f988727086ab6cfc157660d3503b9b7a85eb6d78660141a7abfa6616ac9c28719e2a5a5ef775d419e6d124d89d3020b016986c6bad21fc0f8cce3f58642563edde1051ea670f88eb25ac7d07c42b4008564457bc9f38d2e7e651e20b9adaec1c2dad70ac9afc7113bc150a8c8517fed462ba97cd0b1edadf64d968b6f3f55e372af",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FJuice.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Juice.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=01f860adccb8f2129ff86d93fcbd995f1e88d11a06ecff4f33713a0bf4ff0f8172f8d56a9662ddcb697e0bbdfa4ea3b3b10deeb1636ef8a855996bfe747adf0eaaaf5ff69e7aed2b3efd49efdfb2135757713cb3de88db49b70e7c8da7b555fac696221097418aba4d81891fae51b7ba01e5e1956a94d0b500fd1f1ae0573e853dfbd50a5c9636d23c1d0077920b19820d53d36a3f4bd23fbafc51ec1ad56699d6b50aa56b7ccf762513e606e0d8ade31f33286f94f32ca87643f3c6e7809bc5f09d01b01e539eb0cd8c97d937dd14770509f6634c26bf54e8ea0919c87d467458617ef0a0697c20e15ec413e94197fc40b28881ce0d5cda3d970511c599928e"
        },
        {
            "id": 6,
            "title": "No Sugar",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo+Sugar.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No%20Sugar.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5a4daf430e7f8e57c4e6af03d2dc4b01586d109ca229527e6ba888d173265af40bcd123bbeb460b6cf0461e8678520baa0ab2d4ec526239b8070fbe035f3121c443cc043d5ccceaa697e5e2c7956d31e763b33d858851dc83645729b72358fb36d62f1de77cbbe7e457f9995d0acbae7018b2aee63650c20050e3293e0b4c1439903e6eb19a724e6ad94b5524a2c71d4d2e387ffb7ff2323cbcae6ab14bf2023e59d4e5de06f422776c4367e39a19bf91187d539c83141dd11392cfd19753c4e5531cbba9a246ae16a61054ba13ef70f994e3af2e06f65ca2ea9076856a567b8a4f70a7b7f3fc067357a33ad2872ab9817b7e408504add16683cb19131bde822",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo+Sugar.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No%20Sugar.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5285d4d88b2615238f27be4b14889c0525de3d4e6ebaf4b93edd46df127b29b13c22b4b2ec58b1637d1b627dae2b42f3c636ea4012eb88ba5e8c3b3e6a71a3a806bdaeca63f73f0242d1b9d879c5329bfa31b8b099ec81fdf7fd964c672da26a35ab63f5d0d94d00dbafdae4eb3795c3820e6a60011a8678e2edcddca3be0cf896142569580d7f6daa9877fe06ffbc5dcb6198c47db5d0838177cf1ad13ceb887502a79c92cbb016839a9013625c7a5544facae60a0daf697e93928c3f4f5a5dbe230bb2cfcc85f976e5e4e5222e0c9cc0683270bcf96f377c41b446b37bc80f4b1fb67720234b0e61d05e2b72c348f3d9b2f96b4db15e3f80c4d8cf66c9288e"
        },
        {
            "id": 7,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 8,
            "title": "Sugar",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSugar.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Sugar.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2e48479ad4cc5c4ab81986079b3c5b7e22e339017101324e2c3f4b82ca3fb23c94a7a18be60c1b25b795c983d4891d24ddd1ef5ee2e0255b362a05008d4e6177fd822804efef935f21a21ef92b4d603e601d02be1800b8101ddcd52208a0f0cb5d5b34bf8ea55ab361315e801f2f7db0d1089788a4750badbed2a14444ded6af0f6991251c636f9ba0c2fe6ac76c50256fb9dd591c8e9ffa5188c0a71cc7f1dab9473b67d9f43d8e16e84bf1ff665262107fdd5af53cbd78217f172b02305c5b216166d8af1c020aada038063492c5e7fcdd65f59ea2aa57e74cc1d812f62ccb70f7f9c28a716771cf595043a61930884618acb06af2ae300ce69fb5987974d5",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSugar.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Sugar.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8a58d8db0259cac3c4945017e0e14704037f2ed2f6c646fede553f9e65015f7e2c72979bfd5ba35a8f4a436b664629e10eb9f36d62d523788b22dcf196a26236872d50cc5df3a06d34305f2c7ec124cee144caf378c7a4179d9e5fd674f3480d17d69dcb75898f4a4d6a7712e689b8d98624f4b8f6fbd34fe06d4dc57b15d29240eceb6780011b71cdfb6a834551a13dbd9c8853aaaf037595141df21516cbee669e720a0e209b285d58d7b49df3cad6ff888c37865adf7aba44539f8bfd885280db28264a8d7f32870e4318e22c4eb2ce2d7b74eb91303f41115927417519e43279c909b0b40c47178d907b6ccd0c9b057e5797f9249e2ad169993c7226ed3f"
        },
        {
            "id": 9,
            "title": "Tea",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FTea.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Tea.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=90e26e4b3411d1aeeb3f0055b7da65a07b63d53bddd6144c2895a4a48b3cf7353cb49fcfce938a1dbfbd6460ee9a7cec455c971e9514cfce1ed0e3c43f87c8fc3b1713ffb182f0309b0a0058802a59f46e3427577e6378a604e1de158af9f038a64c4ded62b00a4b6db8c232ff586e9bea4c8bdadc21718ab94ab0de0b92b7fbbd178be4dcfb16c0f9a59e278b4dc9bf8c3c08a50ccab3c48178f8f30d3da6c495c47881b415e24099368a00f0b55c535f024d2a50e7ed058866dad00b45c6c5747cba59fa9ee01e33a4dba8983f270ca433dfc00beb76141fd4f044034ec3a5ec7211579b83be3132a234b81894fe8923220e7fb4e63767b72bbc1bfaf0db8f",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FTea.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Tea.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=287f3c8d9affcdd0cb554bda6f77ae432217ffcd87d363b4e19793a669b6f6f38fee137a112d769f0cd2cdf14c77b9385f2fededd7d707a5b4c5b4badaff20398ec5345823cbaa2513e7244d2bc08f2077a735e504544cd1a264f9ea5917b615e400d5b54f1322884ea047f1477c591f492d4bcddf6bc579618b161bc500a7dde88f5ccf27f7451a617fe9b60e37d20a5e76d725c8640afac537db1eca4d19c6f282e6e04ff0ab608a76a03b1cb9c467e5a3996647786e5dc68769e542c66af45e0a3f1fab378478807bda0f20fd75bc1edc767917cae18be8f59615d126989ca0d587f27b535808aa3353c076fe9da472242be373b7c39fb93393f412c427c9"
        },
        {
            "id": 10,
            "title": "Wine",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWine.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wine.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9c674913ecf1ff3965932b07ec61071272f993f1ddd011eff428c27255e71770d417cb15e5452adfd735cdc10590d10a76d63f3b34a1442f3adee72d3b0f09592ed13479973b7bb4632dcba4be558c855ed8d40adbda6412d6df1df38ada51e48d7e7cb384ac98ea21ff81e7ce2d2f88a61bb09439e8c4cfebb3c7a91f63b496ac2b373be7d399a729b715f133b7b9bab496925b18d959587c344c10cb519af985ed5a89238ba43ee3ac7711d7537914964d4560c61ae5fb0cca72d358b17c2d3cfc7dc25389b23a57bfadaf5bd1ad3a6f6d7164552eaea975c237e094a16fb6c5593d10cf71908f7f28613cd7eb5d428160ff5eb23481efe6373573d2e360a2",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWine.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wine.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=54b5fd5c5624ff4622bbc14c4d378dd6808078b81df835b5ee4f0008387800cb63099e92943f9a2b6a7f73ad517b38aa97b9ca8963f7589be6862b38e7f00fbc568a74004f006d3c75f4920cba3f4a77e27539e02d2757283c2f4a3b8cad7abb694070a0983eff6a4d3b0508f163d8fc882245f244f09f953000436378ad93d247c0d8c71e0141701a97650140b9b6e191df149b9f011595dcd79d0151f41c7186f804643696bdf4cb45dd83daeaeb3b3e6be5397bcf7917f8c7981b8706ae36ed7f2e88cd33308d94d75358d44f28b760ffb828ee38b26f6ff943b14045fb95de42f0422296df43cd365cb210b82967043be03232c701fd487dfaa430efd818"
        }
    ],
    "family": [
        {
            "id": 1,
            "title": "Auntie",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAuntie.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Auntie.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=83f96b83b9586b488878f29769131cc298a825f9fe64f1dad2f7a5000efe9459db3f98fae164f7d53101dc51e4cfe261650f113634e1b4b5b67303cc20b7d8754156cc99ff1cf704e866a57e3f7ebeac3322ea6c98157b95c33dc0a9459256437745a71d8e475ed8a2c38feb3e2d5148d6d387e8c89f87b604fb89bc29f7155fc5b70f121a87ec3d8c2680b9903c23128cffe8824df5b8df8cdc6708ebd9844deec79c1faececec0983f6454fd34141c3fd31f0369dbfe3258c70fd704f83e1a2965c52de358308a2a30b0f4cf5dd8469e3fca65ea10ffca842d96dbee982a4cb12cb586b6e57e7de1145c40502578146ee838c5685861be9e2312a18a65eb08",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FAuntie.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Auntie.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9e2ec553a756f710264f0bf011eb4d64ba11226ddcaf56adb1c60de5b6691f4772a562d8702e49e98bf5146e675bf2259959e204ec2cd3419a87da077162bffcb8580dc8001d6c031224a2c741dbcae1d7093bf6ea02d903b52b83fbd63c821390f024525c34551d9a2bf20838e6f46075e27707569364ad71a963d19904bb6b78e24bf1aaae65b88fd654fbf929813e52f34327c933fd76c145fd02ac50cbca17f02b17f4dcc499d51a8bc7d38127f2ebe3b3f88d75d10f2412339bc9ff3d0e70433984f192097e59f4e2f0cfd80564634124d3e2500cce356ba0410a2f6cf55a4794d1b4bfbd388a42e451fbade3431ee895f84e90a4c5811cf3115de2460c"
        },
        {
            "id": 2,
            "title": "Cousin",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCousin.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cousin.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2736f744d0a2eed7c99f8a1e43b89ea8ef127e3362503fb29374c7d0150136d42476bd3635f52d5b155ea28823784a09f42951c8d1d4da47df804ccf0cc0e9ff6f8cd25e4fd8d0c57011fe4d10b0d644e6593e39db897c947854c1738ca675fc029ac93d6efd1b71fbc6ba0d7a1994e29194ecbc91ebc952c633ba3889204ff54efc2721847bc5028cfdf8699cbdb2e2cc5cc586eef31c860cea762c4be1a093cdf1ae6d1bafc8bb5dc90dc1f30c3f536bab4a4aecc7baf3151ea5601f4e7c933a01189e013f700b21011587f6e9037a504c84466ebd6eb4cfb4e055d0d23d9ff7664c7ff1eb5d2458accf9346bafa9855759090e79dadf7d5c57e8f7a4e34ba",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCousin.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Cousin.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=200c1c694dbdfcc3a4d431b400d23c68c12e57ed34350267e75debb9a7726e440eac26b7a9c0e92a3cf196cf721c2c1ffcf4694b8718dd8629c8f10f23940f68bd621602e08ccf7667044b349cd087b998dfb285472c85c6c16ed065902db851c3d7cc359a7a4b1d64efac0a42c1e1c0d38f8eb9e12748227a442e42033d528dc205ee31cea897eedd789a146ce5641e4ebfa27cc4705f80b77785693aeffe45080df293e3ac161a3e581878aea83cf1ae3f4085fcd6c9aec4d214e4b18f68ec6f95f6bd5518fb74fb3e250f141ad9328aef443e2d50a1e0e4640c7d1f4f07208d549fe435153281e3c227db974392c39b032f8300962af05e07fd1b715324ed"
        },
        {
            "id": 3,
            "title": "Daughter",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDaughter.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Daughter.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7712d73661a723fed70088204bf7f4ceb108a2bdaa5697860add518eb8049aa8f89cfe3faad5aa670e82b3f212a5bb1dd70cb6aaaab65fa2aada0fd6a725880af12a3addf9460a686d18609b925a02a80a0c366dbcfaba5fcc70eef224ca9f1d35391fb5b5807b0536d0578205ca666453df51211256299a546c430d5ea20b9b21c2d10236dc284c5ee787909ead17508eb6cdccf7cbae6ae7ea4e099df552b47eedfcfc899f05080c62230773b2ac34093f6e870024e3deeb983b17c1ab079c0d2ee413c9c6b3db36ad1776c8f949040dfa403b857beddccaeee1932145c525cf8e1714055aff77b2db35a4605562b9e3bbd838bb5e0e64a2cd0fb266ff8614",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDaughter.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Daughter.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5c244f3169ebcedb06a51c2e0b71e3f03c6c2db1130bdcfe68a6a92e743dc04b60ea6971c7bfa5f0ad37b0fc795f5d17dc686855754e43bcd87244ef5b60913614210b044cb7d7dce0524ed29963e8957845ac5eaed1c6d79e4e6a8a9c4d5b608edd27a682d802581f38b9f0233670e4a4b3e1789d7cea1a8d19dd2065e4a9879ce07c858114bdc92df49110b2f74cd4e674790579328aa354ca73fa245e82313db3e3ec6945d1dc68fa57d50866fc95049cc0b77c35e529aeed68933cc74244c87644ef18f2c9cd4d1b023ca6f3036463167ef0eda31706eaf8e3aa464effcc97e37f8f95a6db8541c6be7249d914642fe2746512b35d265a778635bea8abe4"
        },
        {
            "id": 4,
            "title": "Father",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFather.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Father.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1f8358c3bd7934767557da3cba96d3e8a9921cb642a1b8ead58c0bbfa414040c04b3a09b710172f42a9f4882641e91ec4cc1c45dfa11df26603ee2dee3fb1a1b57690006ef8e8da595e929421aaee9a60a83279d5b827113673c1bbcbb42bcd4be17bd5a0ade67188e0a3355393ecd8167f29f07db43e1f1487a24fa05c24fc01fb9e822904a3b291ccfc656a18a657d79dfdf2eca7766010f5b8fc32e5572d965adaf4a5b0c188a0eed98764fb551ef13e7968e6f352ba0e9129a09eb68c0df8deeaa567aa4a6e4a1197530159e307477606ffb4aef78a0ec5ceb7fe3776ba0cf16a21814191a910d9f9037725519d21d4e4398e3225324bea9621395dc0fdd",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFather.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Father.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=512a00380e2599864c73990446d48705ac037dd03835efbdf2b2df595de6656473bdd5cc84af628e6e9241d67f1d19df6572f2b05cbc918b0e04c0723eee8eacf94f7f4f75f0d81afc9301dcd075bd0929c430d7f3a013fc1274770288d13e1d0d275e268fe663d167af5af7bc2857e7a19785ab2f7fbe07504038221d214a0c5b37ded0ea1b2c45ff8ac64d4c88734527ec02c6c45d5b01510bf36ea93fa82eadfd4f6df88a0d7921fb4bfe404e9b5155038d9ecd2d501d14ea67c6aba98ad606e827f8e7576536b13136d22716730f22f909b47cd1bb801d2c0d8e31ee418014555590104da11ade1ddb84c600190bb8c06eec2c0aec6a0e180f7cd818e430"
        },
        {
            "id": 5,
            "title": "Grandfather",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandfather.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandfather.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=972a574f21389356b422908263e39cd9a6dffd686851b5bfe62f3692092bee464ed8b69e12feed2a3d93eeb0607f4b8d54bc59bf0b98e83da9699a2bc35e5809f8f0bf7829949ef223639292e26085f4ed91e2667290e66b5d440afc5e44b3a46e85331a7f48af830988248817ec8de1e97a293cf5ab6f15c955fdc1a97472a0733287a5a6caaac5886f3eda1b2e2b0e1f06b8e0756ee8e79866377202e42be40267c3d15788f42b286f2219f5cd98b1e60baf037e37bd921ab6e3ca207ff27139a998484d9f499218a93d8b8296d7a0b5af208e6bfac8d0aade1638972a4af34566a7d8b9bef7e884f5cd68f436fc59188d22c4929b916c1350c35ff72e072a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandfather.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandfather.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8b7abff6098c7578bd95e0f1c006762ac2bb1c4cec340117fff0c024f5cb9eddbf52d5f737755679000beeac1b277497080ee7de0b36f1da3403071016920b1165bfa4e31a39b1c0f38e15ac2727b7802917d3c95b852a258fb2924fc3d70f16975d9baa459f3ad45509ac14047a499256034bc7edfc2c2de84c03b6e7e3bd66b9979164e7d9af10b82147745b3aa4504a5a92a956aaa8d8ffdcc18d18897b7f9c677696978c6759a529320b23cb97f3f505b009f0864d896644df24b3f709b5636285c8e5098d84ff9ef7a2e774caf38a8e7bce5722d248942b79668311a5f081544a944686a8fd70a089f40291087d331dc113aa0a90021048a552fbed7e6f"
        },
        {
            "id": 6,
            "title": "Grandmother",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandmother.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandmother.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=814d5360d9466ffef432755f8170e8fc9eb35ec16e557dc671008640cba90b02c1adbc1a1383e1fe19dc4e59bdc6692c95039c0077792d725ba1960315f0f115bac9c53e84d1ece9df9f3a4b2d9e76c8bf9e6d7f61cb4ba232095b33b296b8449ab652a7e68932a9bf8db6bc577af6e330f1951841581a5a72745be6437231b773e87a42deaef509f9a298205bd131ba83027c8192521f54e040a64b1621012b5316bb99f9c03c5557ce7e443045d0eb1d88a04ce35fceb14c93198a91f85343403821509e5aeff7ad7f7382c84b71a3a789aeb262ee9b64ef88cf30b7e02641acb10f4a34832b4ddfe204efa09f0c89df5e212e015d5130ef6633473afadd3a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGrandmother.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Grandmother.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1b303b3f8b68b4aac2f057096c7b6e88c1df96ae4e5d1f47e689ca3c372645dee94032df480f9c818142f2248800e10e99925e142454d488c4dcb2399adc549b4e3b49fb2a5d49f28a140409811fcefd62c48988dbbb598b48fcec299dbe5329e496b36f46e99f31453edcce6bc95b699b87368e1a8c66a1ee6c3e8cb9b471d8ae4a9becdcf1189e671e68ff36c3b98c2304678cb6584544fa85311c5066ec25d2dac8a3ce47f1fd9d7be92be922ef1575a3d5309459cfc399fc8300c98a61b23976c3703603c8516764be0d8bd231b125abc730971a9b6392b95086ab27bf1e3ddcac6ccb1df46bee450b4f8da940fb58822b91647a3bd58def25751a59b58b"
        },
        {
            "id": 7,
            "title": "Mother",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMother.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Mother.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=92c556e4431d371b43edc372db5e28e718d76bacd89a8e8273a7a81da18f7d0e46c9d54534c431b186e984da0ccac9b017cc5b2042008d5c652afb5fcfe3bdf3d266e28b18461d7287c6eb1e5e3626ea1c63d7935c44d8357e923353a650bef58ea911faf061dcff5ddb744207760cdea253edac933e4b181e75acb7e1af1b786f2ace041968725d534e95f4ecc37dd6b8f56f8bf2f2e8bf018d4de347ac7268da36f07f4a25c1b565d038edae27067ce4823c562aba89312a5601d83c35511a8b026824a91cf8817ffd8aa9c32c9cdd6183231c24410b828cbfde74af1fd72908f7c7350fc35f2515bbaf7752126de3b8b03365fede57359d16ef6f977fbbb3",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMother.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Mother.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3775959ff81d1cc021049adfbb2b917d080242d3d6219d452dffe4e123390ef5e5b32a08c15660656366e39e3d91806a97a3e34f5f2e8178fe370e352bf9f6356ea10fa55956ecb2821e21abd1cd1f5af57a8b55aacdd538b9bfb0d2f696b2e4899e515f567dfcdfedae98127cd90b812a05385637c52b930eb2ad4ea4ef724fcd95ab5e874778ac6564f8f136aa1c1a5e2b5ccedde30ac20f9b934fee524a15e195896acc55195eb568cf7e5cda02d3cefb865d57adf50ab32d14f6d1e82bb7d89e0724d380f37b7169785fb3951523aaf67cd91b317dc105cdb2ffcd6db5ae2e3abfa0657f7a0543431f11e99c57ed75bd1aba4a615b11abea46c210c6668c"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 9,
            "title": "Parents",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FParents.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Parents.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=557fd8068922a35fb799365238ced741a56cbe9dcd5a4bbd364eded7344e4c0f1ad00d4ff85e14a3264492f18e92dc0a0e77dd1ba8c414b58eaea49fafa93fe8d847549f6fe0143e0f4ef91125f3abacc549df89be703a6ef4706e90b87e40f14c9f7a9c82b789210ec1231a2b44e9eccdf2355cb5ba4597f03361ccad8cc277725a7e8523e524077dc368f7d7d3a68d564d20ced5234b185109a5c8db2f3f51a1b5e143bdaa126d663777d5874056d5f76be3829fa9c0dde7d86dd0642930627e5e6857cdb3dd1065a082889df6dfeebd9a03afcb5c7dcc8acb692946b1e5f04a9cba970ebb4365be006f7c42cd5d5d848661be1977aa2e0bbb2722e12a49da",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FParents.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Parents.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=18bef3a59eca19408942a0e5b5049516951c7e02a044fe28b9adb3c93934a7ee4f3ad7664021cf86caed855c978661d44971a9478bc31727fc84d85d0381ef50c6fe1076b480e137d4fd077d2abe67f4886946158ea3b410b33cb20670f419c0b969410f6248602b23b1ea8be13475db7fb50ca1c8b06dd11c039562d667c15e4ec4590722e393d9ca54ce59fcad0284db8d60cfd2461a544ae915c26a7afc5c97134225870b7f3b73f46854c581ff100cd22aca1a6732a63641156c9bfab1632769de402a717a3222b08fd9d4e4ccba72d9ddba8ba566ecc0ad0e1202480cb716d4079052c853ac8dc9b58719b878f9272627364c02a29ea0095377a3397eb4"
        },
        {
            "id": 10,
            "title": "Son",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSon.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Son.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a218d38d18eaca693f89a9e1aef1f06c90a58cb13529692c0c0d391f7d93b4988e82ca2cdc80f507012998fc209d9632908593d4b41bd8ce51729ed615ba1d4c462c29f761d40be553cac6f02cab45fb9e1db3ddc8bac2ec03825ac021e260a2f63c6824cab35478a2b00131deac7d14e20c0c8a46e3d9f65903127aec75a4edcebf9beb91eff0f522b0511abd0d5c8b868668e317857c9d80ac509b790b6fbcfd799637abc08281b2abc8743067f2bd395073b959e3430ce14e5a265fddeaf400dd9a6c5c469961813b49a78a1ac17916e9cd536e9634f30fcd406096bf70f036b6d481a0bd152f1df9b1ba63495862ca3dd274efe894fc70f1a2afe6a10316",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSon.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Son.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1d5fa21127bd1355c00aea8084b8dd8820b0d6f3777add4b1757f3919e9e1c75fa0ecb1085c06bb977ee7a6b024984c2b07efaac6a0a3994380862f1931143e7d4c8dcf1a46ac63620fe4f1bdf0b14806f8cd515e2f1e0d8e10230e495b06c987221874b71e633aadd3b872353b379e3631d9a1fe5a933c93a8dff79f9e90eee09a82d2ab48eb777e62c090d75206831219f464c9c9fe50c2115d3da9420534317ca17d35a417d779e62f2b13a219dac55c8df78ca5919f256104511155c546a06681a5c9235187dec8fafd06785ffb254fee72ea950c38a45a0720e2217d1f4e4ba28847ec91c574d1022ab9a7a8137f43b86827944366af596e1cb9aae9e01"
        },
        {
            "id": 11,
            "title": "Uncle",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUncle.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Uncle.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=41e720d7bdf8052b48ca1d55672fb5c50992bc981bc95cfd4c09db1819e696e21a9350609a5c5115c697c9949c715a6c0a3e3767c06306175719b865744f0af9a63eb5f41a36df69f7bfd14dec7c858a806bbf6f5b3c14b20ff010336fab5157708a0746ce9177fdbfac91c95e4e9009fd49863e1417f072201a0b048b0a6f0f0666190fa6b9b39168c9a660a8676e9e2ca7e7b86bedb96f3d779862651a64d91dee21f05f4480a1f0f52dbf7df88d6d92289b18d7cb97dc03fcb5444ddde1be142d9390c1c2dbac41aff0a34058c6b8ca55bee4b6f4e0285013352bbd522696978e004ec6083f310b9c80173eaef1da873e0a1ab4fbba707a05b5a80fda7f98",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUncle.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Uncle.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=28f923fe1058622399ae4dace99bcb9096be829d20b3f27a8bbace47dc0e55a185cc05b3714bdf916c7fb711e44a2d2db469504b660582d3314499de983de9fe601a7a3bed8a8a0ccd2946975dcbde71aed9b8d80b2ccfa0b4a5636da1aec7c17943a4b4ee3d884700119bb3222eed3fd94902aa5758671b46ae71ffe7da7cc826e2659555d8b4f000cbbe24288ea5c36ffda3c0ea9ae9f5e96ce8314cf288a5a5f9931c7024010e3c1341da01fc0846667a3114b63e48c84ceda23682dfeceb13811d90dbfbf3468309eef5a62954f221e710184dae6e5de479a0ed9f3b569aa602ead2c022fc7c55f65b206e48f3bc18807e6dc3c7e113d13192021a80787a"
        }
    ],
    "food": [
        {
            "id": 1,
            "title": "Bread",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBread.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Bread.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2de35a6d2e0b28f9e020946ebc48690e69464e25a5d7eb438fff0138ee495f91b415493778a5ea097f6027361062b5a35e38d07008d916fc04a3685581d6e9ab8569cec85b51a27114e1c24c5782b3ab8ad1a92abca3ccdcadfef885253e13520de75c011309bd5b048dc8390696a237153e9633d9b7ed670720fd94ff3ec719848c5edf799a0cbf6cf1691dc5069896b7dabadec4b46521717b4812c619fd88b6633e476549828a11e4a2e10c0c85883733de66defe76e2fb1c5c33cf8f4753421f994c63868fce5bb6aa28738c990199cf28d7095abe73e29f7a5fa279e5409804432f883120f6af299943e3955c6fffdf86e3343731ff9395eb3a687bb2ad",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBread.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Bread.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=383a3f45cedaa45197268387ce85c605ddde72906f5954cd33cfe027ced08a21f3240d78887175d77987b9700091d0bfc476e925050cbbfa1be9d5e83c86cc0b640c867b20315693fda8b858c7f84123c12979ed3779ee365fa05d3ab1199cbc967639802913d6c004902098203c3ffc51008c1f815a9e120a338faaea51a1967d594ac91311006139bb48c5aaff57f458fb486803703a598d49346960b7c54864418e092bab5d15e85f1dd19b8b8f58a24ed1a52d9c77616bd13a520f790b7a729d2365e2ba3ec0cbf03f61425754c5ce03aa367a1478aac77d2cf3973422976dac0545bd5f0c640712fa0a26b2f96ce4b4ec8f25127e1a620adf92e7bd365a"
        },
        {
            "id": 2,
            "title": "Crab",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCrab.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Crab.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3bb8447349276720b77c2f1be1977964bad06062f74feda8fba8e305b943dd21bc95854a70ef35a3842d2d1c6c5b922847227e6589779a5f521386dc1248f162697d21928ac0080501e20faa71c8e0544a539709889a3a98958ad47dfc85c3ba049a2cc54ad4764566842683e0bac522b05b374836957d123d33b7818527e463ecba910871ea129ff3ca8970d606b22920cbf18e9b2643390db4762836206c159c6bd279089db2d477abb45a048eb5720cce859fe3e58011581a1e76551c5973fb2bc7d2accf2f3fdc4cac81470efe4c7fe4a3845e1be2ec4acbce402f45d84b0010a5e69d2696f1d29fcc221b18a0d351ca20690e3adfad003545be11fb2ef2",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCrab.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Crab.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6e2d190c08d27ab3ab3410536cb4e2b36533bf806fa21bebd0113e7dfc8729b1b5653dcad30a635cc14132908a1b4f95ba7219a15d8c3a5b7e7e9e2f37f6b71351853db34324ce17e7f9c32aae75e6e11402cf95297f0f5110c6bbd10f712ad37a4ba5e375de4d994562512dfcb76e5b40d1153f2e7cb565680cffee4e9dc2ce89ab98359e458688eefa9fda2774c9788d85ae91947ccf19baaee8116f5785e7327219121b123d2fe772d7363c0f4224e4d407f58f96ea2d990490f635dea3634275d379981d477b963a5dd54bfd4e4f2216ce5135668c448f407891989f49b3a2437820d396c2ffe498fdf8f88ed7266d3fcf8d667790cbb1bad8566febd957"
        },
        {
            "id": 3,
            "title": "Egg",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FEgg.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Egg.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=53f18525601c1062a653ceae40aa26da9ef6e90cac796825636699717dacb8a8b222c5f2f85d0d5d230417aab32a55bff6b9915e33a437eff33465067c7ee5e8d3e5566d9407fb2e8468c4ff5c38089ea17faa4d8a924607e90ca1fa0aa4262c41a17eed8301baddd69bc6d5d21ccc898df644139cbae80b26a0c523a7d9fc3c03ba1f72ee49fbd7868a06743f5c0181fa7d9826ca89b041e1fb0bd81a7bb605722cda5b138b715192a60f43446a1fd84b02ec4154f3722e474912e0ec77da789416a3d5f519f0b772f60f0335710c3f608c8fd5b5c62e9d6f3a012f85785b4226475a228c8feb93b94577c6125585fd46296bdc2497f4b38886fd2d3ef27ec7",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FEgg.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Egg.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9291566eb00967e051b84582a954856689a58122dd6e712b1780ce4db922bf11e859c309af9face0fe0ce26cb4c4a66472fe75f446f9beaa0e1d0423fc2e2d5449f0f35113a6434b29f98089a0abad2189a5aee645585118731a36fd56da6201477fcae851fd33867f3eed4b4d6cced17a88fab1fb0fbb068e95100023c6280d040ed58f196dfac0139a41c0d235ab5ccac806a503d6ff8ce2dbba578faaa8f4cf7fd601e08e0a81b6b2563524a039024b2d1196da5f8abd2c2e00ade39674814b590212cdea7d2bdcc8bba80f0b556dca37421bcbf278bc445c4f69675c8935d258e8b6fcddef751cd3426d198af7e344fa9b76b4728744c1ea5f7cba57a924"
        },
        {
            "id": 4,
            "title": "Fish",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFish.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fish.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a2cc06d2c81b13bc57040e0bd74ce89c33cd89983e5cebe14e2ccae4cf45f74ac2f5d2fcebc450cca3510dff64a464d27e323c5ea7782ec12c60a155a3f05a4bd7f7d74fe5419b90fc7aef75fc4f63d4ba8482933d42f6e160919d5e01f7a7247e4b5d8a4d7dfadeb6c6476c7a7d900ba18a7820d9e4ec8bf6fb056de3c5585e56c376eff819f8771b990044d305d8b05c2dd593067d5602058528e4f6c381d034ec12593c40b745ee2e80eb84acb448350c66a8f81cae65842c5929fd0aa6f8206c89788ddf84306001422ca0b94cebedb330fc23e381a828d5af6f836be7f2f4408ca3407eb58632ba996c00211dd6ca62f57357e509d0fb8b01b36a0169b9",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFish.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fish.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9aa14ffc8ca97de6ddf53b56952973a8ffcea19f4591ed20da1eddc1f2806d406d7d8f1fb61315a7d17ed4b7ef6d9833c8bf36d6827165b8eace169b113d9979f3e4a3113f9949d30e6ed9fa16f9c012ef6bd2f35ec72ccfe5655c61ef72fb75b6aed713f410ddea8289c66fee07573786104b16a05a0ee06b6bf69474159d1bf04eeb5decae8be7c28b117f56f767547124b2394c9572e25219b74648ef70505571ba536af58f1aa1a23a8caf6de6097a72a24dad45c5f80cd43b5739942c4a6490736cfb5afbfbd1fac765c8f6da2f835e3959bb98a6c4219caddb94e42e96d12b0a56eb9d8bf7d04923756b7a3969548b125290f084c0c8fdda51cd8e1de1"
        },
        {
            "id": 5,
            "title": "Longanisa",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLonganisa.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Longanisa.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6d30113995c5dc073da6312a9f68a711bb192011bd61ca71f7373a5106a2cc52f4dcabe5b47004a81d7012e14946629e42287473671b9e2cc33b2308d2820e2eb54040085dd220b50da0bad3cb145646b5cd348f6c03a8efd12ce8698a649a328a4b5d5a8b986d4c935d9b4ec744224bca48f9a51f77f2c8144bf748c6c901d9bde1c230f90a6db3064d0e687b46c64fab1474254dea7cfd8d62ff102bf7f3739e7237d56f34c92cae2361e970887aa025ace8bf95ca48ed5fadd6301bf7c9508cae042c87c41c40d4f55b2c5f87d17faa2240b466f92f40c3c154e0d2b5593d17fcfd9dc66cd8c808f1f0ee58b355efa514737a52ccd28483f271719ae98aff",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FLonganisa.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Longanisa.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7a6e6abdbe40f744fefc98763183453b60db5b40ea89a778f262529fc97eb340339314b3cb1f4ee87fff9b4f3e9428418e7b5eac9247d39b17d640f207e06fa3ed8e216a2bba45e998d651e6c923a7a213ec36b04b30628cea83c2825bec9e7400673e4ed94c61374bf0324a72c77b99cc36d4d64069e0289c1c310105bc8036a53328885849fd8d1843e4ed36c7b1e8385f9287d3d823edf96a889bc837233504055d796626bfdea83e7f329ef75eebd0b8ca317494918138b5dae8db2470b5f3639fa1a42b5bcd03916b9572e2784bf52b304e34999e2b117cee55d213d54c687088b5c7ba95688c6c5300465e42938ebcf6e8c705d65c612e061b06e878a0"
        },
        {
            "id": 6,
            "title": "Meat",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMeat.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Meat.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7117e9ae634038facf1ad1ac4efd3668add5090f17608182f3faa83c32e072fdf090decdc9076c74635f2919980f050245c1839aa30e1556af9b76878001583dc81162cd40f74697a96b25cf70a10ca2748cc079e3ec5b2f60417e1fbbd5b52416ba396014e6e6d15c4905f5b9a708c182dc97d0a80b1f896af4e54a818a8c9d0ee9bb5537a0cc0110eb9e7893872d567a4588fda07eb65dbffe921352d21f13f868dbefef0bc463c740de6defa8a349d50f3b84f006078c60ea762adb5a24b4133717d612f9a9cc695657fd969f4030f55af443530194c32c110add3b9585450b3d152a34592fe0333a9273990e72987bbc7d42ecf791e09186d988c53c61a9",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMeat.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Meat.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=770631b9157a4a4dac49d6cf5ac87f8dec2498c67002588b9a5e0e4d61cc258e7caa56b1a57660d1c998076f272aec00bc694d3135ee02bfcb554804dfc09e054f2171a41ee524fa5d416891be39362f9c8cf9bd987a6ebd145f564247ccd9c53784bea0ac5b220ee424d067fe60b74775af96aa8f6d29ee5a347a18973d5e19e7d8bbb4d6a0c735630118ed85682e125b60b82a70b2d7e0f5ea0119128d3a4c5dc6b8c78c12f45ebdaea93c61c6d45111df49bb9baad487116b83b6e053d3460e378145b813caf01fb0b32f34690b3d219af8244c77201089a1e24364b6c301dab5a6314f08819db9bb0bcc07af2af3e8305bc326a68a0f0a776f0101cafe9c"
        },
        {
            "id": 7,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 8,
            "title": "Rice",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRice.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Rice.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=64d49fff29caeb61d0a672eb71ef31b24489b7b0133301e786eb7b7733aa247fd3767f470f4412cd9524d702fe7d7590faa52820c83dab0c61327c58f3392ea654a5907fd716f070ec75cc1b2d11ee754d2463ba18f441c79972d8d8985da61554ebb9436e2d9c3df8aa6aafa3fb17773fa8fb8bb8d1f852deefd06be42585c1176d851c5d5e61e193590e6c2846ddc394b300a627560bcf2e57f8d18788645c2df0a7e302e1f708f8ce9a75f15f220fe82a4725bf8957edf59ce035617e0a9430150c4c40bd1c12a38484719cef28ef85a1c8913c2f2cfd1b67fa56bc88993ea4d4d24e51918a18394816e4f1f93ea7d967e0aef5a80006bf0b0ee4c3b01ce5",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FRice.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Rice.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=30b91d19f2a693585208860d85f09060586f753ee2425de400913a24a34b10f442063432a287cf76a706ae310e634dc56618d94aaa13a831092b1a2dd13364fcc8e7827e273dddf163e3068a7bf630a27338e3839827faf377d96d2f869470bbff1f66753fdffe1d382440d751baffdfb38eaa26ea855db223f8913876ff75231cdcb77b4f871b3b89ef56d56d8b8719c4adb7a87dabd8b41f0295389d9f3292e68ad5b79026324e01c6c09bbfa1e67c5ac3e347c1713cc8b2cc3cd1bb276b661bf8b237b9f49a94a31c622bc452f47036df94afffcdb781f3dda156fb4d0410a428f39aaab9e57a2f74fb2ad63db7ddd1ce59199619e6ac3b3cdc61de11f80c"
        }
    ],
    "greetings": [
        {
            "id": 1,
            "title": "Good Afternoon",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Afternoon.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Afternoon.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7290256ca8c75a68745d4631808d094998768cd6a521568ee0574252da315f2155388c49addf2c835a9f3386bed6b27f232b09b38b885d53d2c785bb7c6a23afb26a97cc388646fe165ce929b397fd2a0608a133064c0cf7629f21c5b2f3e11fef879927197bb03cede2c0af4da9daf4ff7f5ab34edb8e2c9f46127221669dc2aa9f47342bc0125a5050f18c71cf545f2c8d8b9fbc2763996bfcbf389164e7705847d1ca345fe6cd77a5f60cd8508592e7fa49b45a1043ea464db356ef9c6b95553537222df63f8952272c7b91f3fe172ed018f37ab21ae2c52d75321e098de0c135469e253b0b0b496216b176a3063be90a4fc143dc7f1f6bd6400304ad7d88",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Afternoon.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Afternoon.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a3d9c5b3f9d514ca714797d4fcfe8c08154eae9948e4b19617054338a7384cf253e5c8c9c59893dea412886751ec49afa3cbfde30e466565beccecfbcdf93ada2693761bbf1082a969495a87e9ea8ce36a58e0289e4483bd8cef8290c1cc859c0e5426970a21f2abac3b4f5ea7dad04494b5b6087d2c5304ca1dac7fd6abad8074fd5a471a8bbdbfc2a10c60a155fe6602a6f19046ab21c314b7262581cc4705d215c07ee3ae5681c87951968ba88c2889ac6341016ece9e83951e0d7edd6e1e6a74eab63de5aefe27e4cc6ba354f1461d21dd94a576c4640b9f473ab84a7353b8fbb2e90427f685f3930b7c00ed3a67bf8c82a127be34666eafd822fd3d4b53"
        },
        {
            "id": 2,
            "title": "Good Evening",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Evening.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Evening.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8203754440c3f1eeac1e1155c42134230ca4e2e8c4ecf81c166b48632764af5d4b20507fa43b8de7227e4f9b751552be704cb3da87fe464b173c8e2b35dfe9161e9f837a0d51f781f0cfd3b56d5cffb411c2eb40ece4528a0d98209277a794261bb822aebd2bcc6d42391cac26d756043b9e4077df1fb556744b2eb7e3e9b4b3a532abe1689263b1c1060bcae5a6dd53af6331fd0ae98e91dd79ac6db409e24e8d3a2869534f0b2d7a71f85b3f8d1f95287ebf4af1ec189a0f4c4d97cac6fa24cafa8f33b663ebac22de2436f55b36e3989313f9b3b9ed4f6f79b1bb97766453b32c4b97a9b2e354dbe6929de2b575f202d5a7c545213f9878b0fec45cdc731a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Evening.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Evening.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=993a23d46215d71f96bf714233952007411b95d6ef035801b9b8b0e94e32188158376f82848c402a3b445aeb5a2cca6fcc22e78ff9a6d2ca214fcfcf7a57b121a492d7b7a44250674dc7b8dd093ed750d3c0ebf2da653c7f86f1162c6209bf4fd7d0f4baf1f8c1190fed7e8b9a50baf2bdabae56d40a64694f8bf3a879afd1bf19c772c5563c45eb10a6d058f1efdf68cd40e0b92ccf6ae8f98600f9803ea10b403be52218fb4b2e030ad00fc6b5a0d215a7b1f9f4d5810005ba0afe4ea07325a0bb1241feaadc8c1f9a1446629bc6d07a2cdbd150c4ae62e84574e9a28438ec7a2ff93c1c4c8e274767ce50b7d1c076a3ee7ae5608885b6962cd41560e91b08"
        },
        {
            "id": 3,
            "title": "Good Morning",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Morning.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Morning.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=89184e09de3d4d5becf8719ec6a5c5424d1419f51f42ab97761015ed45c7eec0aaa4c2f73358a96e46edb36b2392709a798eac59dbbfdd8af83bd50cbfe38738521d0d116fe1027048cf6da89a641eae0286a67bf8cc6fd14b7e1f227760c042065b14004b3a379d6ca9cb44169297880a322252cdf8d5adc58c097b73bd3c61a319bc238b18c98bf7c8638e4ac0e0515a360df8ad907896b24b48dbd3aa54d5b8849b6ab74e5967c49ebe05fa7d51dfc240e547b007d8cc8952fab21d0344b5254ce0a7674381ac169a7bb5b9707c866fd149fdb99b8b8be67e2ee07d35c38d6b148bba572646ea0c0b750135658f4bc256bd2256ac48e33e230adeb39cf707",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGood+Morning.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Good%20Morning.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8b520394b23a410ac315be9684bfbe661a40ce9aa8fd89086d7b148fe04b6241d6503598c626f9d1985b802df4c9e62ea2db918b2ad6671395b036f3c225117ab330a2a3e7649d417d9766d623a470f007879e59bfb7367e8419a253fe4af179176618b6e00477d6fcfec69e2b4936ef7d7454a5f57d5e5116028a3aae5f6d3b555dac5af0a733ff4135d6fb2e77f50e627835f76b132826d295d7e2f743dc8feabd579ab19f4f09af3802d014e4c4f8b0893ae38b635ed620b603414938d2bce004c428c711e1fda5edcb846387f28d7b852d40e2be8c7d572cadb34f01c4bf465521b8f1abed3e846b7c702f5bb750ca6238203f8465cde56cfce107aff499"
        },
        {
            "id": 4,
            "title": "Hello",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHello.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hello.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=60fb80949de78e1285d64f812c3e63d9ccdf7a4db246c2b525739d57500c0438e07e00effdfa3d42710f05f5bacf06305f187d0f4ff0ab276f920137874a4e428b46af3436a719482289fa49e316d6989cd88594a206637d23934ccb74db4079a7d2b5a11f4b96acf7fe1b4ead962a63fc097929972d87a2cd8585e2834e56d1598212e23c966303b3927bdd9a119e7c3f5603be3ebee5c4ef03bca3312eecc8cc59519750f086740e77d311a5253a2ec9ed8cfac28703a052b0dbb3645bdaaef0f762e656269e41c20c4d0a4bc891e11938df0ede9534c8644df6e99235de60543895ab610d8a0e538e105c32e39d41aeced9c23de86a482d1b6c8e5396806a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHello.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hello.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f755e8e89924334ca8b0bce65b58fa18c677b3657bc95198d8d770d500c11e537dafa1ee49983a5783f11aaa697f67f68a43e9219f6441bc4a9d566d94295497c10c4a39f6f915172a7ad22491fc5ad35501f49ceb5492daa3fed4491c47ae1456cd1ccdb3e6b5f0df55508bed18784332f971104dcad7e5a66438af58f802fba2e2f196a92f063805ddf4197c333ca938c245fa3d28c58b336c8897c72d53e4d6e9f903d9329306f7c57031a79200ee90bbd07c99580511c311938d5c52b5aa336cc83f4b39618abadc543e5c5e395f91826d20aaeb0c93887acaf64f53238e03761f4484b51913f33d645ed9d48f70745f927d28748de7cffef896be27369"
        },
        {
            "id": 5,
            "title": "Howo are you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHowo+are+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Howo%20are%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=68393ff0aaa4c3ad6202ae5e27242ea17f2dc3d530e753a657de56c5a66fa7d5fbd0136bbb4753b083b9acf56049c4a1fa249a8a6d7542c26a0bca6b94196479562ffbf944196517f77e17e8813cf3371297403ce810bdf53ee73146fef2c9022047348204a78bdd0bed8bf37f9a1a8ffce82e04d070253e03238b99c9a3f894ee9e2941bf73f7320b6d88365c54fce227d7a0e8b75707b2f8f886b60eaa3cec5720b96ec9c2ad84939d9be4371990f1aff7d1ebec3a1f5ae4c1dbe77d340aae2cb87360e6fd30571f2496eafa4a426ff04c7872d8a821de9034829ad8853c28eb8e731bacfe0997962231c4f2d2234b411e66b97be06845038cc571bb318fc1",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHowo+are+you.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Howo%20are%20you.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3ea1d9135860ec1fd2d562e4c3034aca9dfdc02b6e4542bcdd7c81428c369f74e59d28a6fd1afdf76ba2acca5714ade13a3a88bdbc9b3a4be60008a73b5ab6710ae35813f6a481a7969df20da900b5992b2467c47a30ef77549867bf2ec7815ba3f6790d2677868530c9535bbbb6575ec857f50e056c0b7897da3890b2e1677646ed37126e6953de1bba97151f358e5cbe9e52b1dbf1e6617d3f38745b36d29f3a8803ae7d135b45a3631aea99d40c3efdc46299ff7daaa4329610e91506778ca39a11fa892bb9116cd97bcd6bf05a75d4afe0015597d36e42675e19cc0afcf9677112ca1be25ef151227b1963e3d7224ed01a19773f280d4eb8b298205a8683"
        },
        {
            "id": 6,
            "title": "I_m fine",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FI_m+fine.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/I_m%20fine.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0cc05916ab16a7f4e33f1f0efcd0a250cdbaebcf526d7507f65f49688310a0daaf35694ac50023c12dc9d7f9ba357b655560b1f697244ac6eb25d578df4367f4b20f9e157d95f29d51b47e21f244a2d96bc459846abc786e35655d206d6f2d8e639259f21d7d06042a35fb5ac71aa311da4b832ba542d090a0b4200c265b588ebbea5f530930fa06d621d1606dabf67186e281717aa373a5cf74f24558702e8c35151524e2653c4cf47f88bf4c42974c386122ed627fa15acee4df22a5309e208625c93f85c533d51c7b9c7419e1c8cac0d5af1c2f27bf6e13dbbfdfc22327f03ee257b5664e272aea50ab244e9bd24d15cb2da993914d7c736972f6f77d0bae",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FI_m+fine.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/I_m%20fine.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=95196338637936009cc212cd977a6ae79c79b375c90d69d38e85c3920f49ba08aacf2a1a7415a89c300ab292c3399ef5af94943fc6468240f4e493804d296d7359338dda092c1182b952fea3e7c51a99543c1d26fdb033a70947e75afefb43e61f80cdbe54ff805cef44698960f0329cdb80f0ee39ea10f97182342ba3017a5fac679653693f16aee594eda7a42324f49b42c77d276547d6112540f5d1a6c429899d66d63733682740dcf16d5c8669f118b6fe6817720248ecbf9d6e529f4f6dc6a1d89510e00fd370fce6214b34b16db47860aa575d3d850e0190bf8047e834e61613573a69375829a42ff8dd894734c224bfb6aae72f776ccc4dd8adf72e4b"
        },
        {
            "id": 7,
            "title": "Nice to meet you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNice+to+meet+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Nice%20to%20meet%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=4dd2664d08f7c2d206433cf389646ba61945c5678691735c533bb39c3aaf734c1299a549e6cf91d4ad5d678f30066c2e6ec59a4d2ead6d6d1202017808d61eeb630484746076259e667c2ef08d3c4c37988fb7e4bd27ba6f7a31d01a282b05cb6d530eb30468a4cbb79c00a16e18074001f9e832715ea0675c09d53a2ac9cd2a174f0fe0a695bd68c793181bc882aadd044a1f22ccdbad5996714590e48f63a7cae5e3fd65dcf01230c22d5e1ab22fd8a88988e88cd9ba41fe6398fd21d1252f08edd958b91902908cce9ce38c3ddaf0e9c10ff1d4cb66411c8abc8ca6c75705a74952ccf82116be7e9a7579b22e81c9dfe310ee33cc7bed68bf4a3a70439c2f",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNice+to+meet+you.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Nice%20to%20meet%20you.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0a5d77c255b61fb0b2b1e634ca7cebb7ff4729ab6dba98832dee98ec127801d991577b8cf809c45df6198c20e549ec6ead1949b2d6dd89cd9c665ecba90bd622011bb2f504a9d9e15ea620e0c0408f21eb9f16007416d02afff0a737af1105397247234bfc789c4d7f301eed03f2da23efaf2154f06c4b797c5f64921d39139c6f855326a487c9e5f430a6fb3baa98124d1170a39c95794845bef555c452e70492f83636e458bc98080a9c845577ddf9acd30d208615d55c5e9c4cccf22cf1f596de87b3d27c90a914f74bef0b7a943d7e9ff4a95880026a4e0804a73573c4131ac989ba55682444df5319758f09e7a41130357cfefb57ed04725c808260d07d"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 9,
            "title": "See you tomorrow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSee+you+tomorrow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/See%20you%20tomorrow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7ea334c7a18f63b034f561c057ca29e0eacc6805f84410cd1e57b701b7e3af7eba844a0aa855e2156e8d105f09c55af86c7d9f9623d8f7c26f546403e61ced09e73492e398393c2199dfb3257fc02fe3bcb183db1eeb378d6a20bdc7634ce946176efbbd8f7c4237a354576982a2112d4668ec56f7c17df61bc10f523e683c0b2e02e9539ce41e242791faad42ef66c8d5636283d8043c0e85c30db01a2cfc2fc8e90c3816c1aa62b801920707eb21985688473f3c0b3f77108aae82905086bf3a7408760c6571af536f1aadedc9c6a380d9f70e8441338fa42d54e490a1d7fac356759429eab3c1ef85845a7c08adb1cf7efe941d580de96460c66cb1913cd6",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSee+you+tomorrow.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/See%20you%20tomorrow.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=937d8c13c575ac9fd594cd59dd77ce9244a11ca0e4447acc2609440d084e632ee0c1d7f72d6679ae26af9fa6fa2a7889031faa396155331f27096b3b7e83c494a9b4977ce9a1722f7c7cd08b114f9bb9fb0222e5646da7e93cb5d291a4de5726d75edb5d1e27430c5adedc756738236fc09b4c0bedc5f8effcc4ff54a32ca524d2e9ddb8ab75ef594de3e5e409b95baf29f4f11ea5890006da3f658fd858819631dc2ae7d0aecde08e08fe48399e2024235b307147b1746220d7674c1f658086dbc21cc7f6b278c2b7039477bb956bb5618197da932423a1da2324e9f63ea9e96003452dc6b69f0b5e4237d7d5186b14816f7423f088073d33645cdf57c29560"
        },
        {
            "id": 10,
            "title": "Thank you",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThank+you.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thank%20you.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6a4ce3fdff6cacddd07106bc0a4fdbcc88937d9d8ed205d39afbb185a5f9f233901a665894706cf08faec04a0e89225174a1cf6c38a86d3d3235b7ef9db435599273cee491021c12afe5d21db75963360621c82b1a0359f131fccac673f5270cbe22ce84373a1c918d05c56c0236af0e51d85cbfec8ec95540b1ef8deff76d3cc963a0bc049639867f30545f738b77f139cdd1e7f28adbb2b89fd749889453bfc1d8ba6a1969528de2ef6780193ed6ac976e4d0017edf922db914050288ed0904d700ff0c3ac69e8c2c526537dae6a04eef12a1e417d2090bdd5e1d06e626074af889bdd5ed63fabc7ed54d578339a6b157fa4362ba3741d4c0ecec5e6926a7a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FThank+you.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Thank%20you.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=69254385f7a5a196f561f8190d634ca15baf862a6c9a24329ee80e97937025ec2a9288facf0d1329caafbe208500e27a98cee064329e5be88eecb4bd44dc9d50f123d0c544742f173dff840e97f8843002f874667a8946bf785c142d57f34c511bbeab0438479e1c0c8c39730c9591a34db7dfb49563175265f3dddcd7844f04514a777d506f3709e6a569305e78d669e8fa2cd99f2775d5d31a6b9ba9a94c2356a4c00cff5563a3afdee0856fbbab6fbf655eb755e1b260c3e931b5a70453de69020d4fbf2fa965e4b193d71a49a075b02a6ffc1a56ab24a18f0884692312245f21663eb5b1448ea56f26be6dce7018b431e47098f4bf500fc406d3b8e74814"
        },
        {
            "id": 11,
            "title": "You_re welcome",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYou_re+welcome.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/You_re%20welcome.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=72861272affcf29ed16c1a3fdf591a4f838d0c24bb174c303f6f2cea26136e2b4fa0eb94c1c28e47b288643887491a637a0a076a179ecc02e0328e291dd153fe144dde34b6ea0f829d2ba314925679d20b03807ff6cb7ef7b9af5b492f4bc764510669b818ffddfb339ea91436debe739ba76a0b15aa40b5aaf27f45b6cc1ef28ce29ac20db441149aee60101e43451a7fcd644ed4265f130b935666d76f6f16d43555abc6a628d757489a012183a8bbe66cd8ad420673ab2cd36af632b49f13fbdc39f88ea41839358e4de3ffd731278b35dff51555a99f24cb76d0239cb78e45e7f66c28071a60901f1a9c187f62aafb569e7c5752fd72deb64204aa9be1a2",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYou_re+welcome.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/You_re%20welcome.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9824af1d283dd7c8717fe3f2bbc5e195dc2f394212b033ec904dce55fadafd9a3ae6264776599a21b9e0a4be73f477dd60f35d182ffafee6c068c96ac737eb10a909f191afba7f3fc53863e6a8ff9d591057a20ad23b8ef71820555c2fabe5dfa716c4517b26ee36daf72a3d3d4ce7ee592e54861e582b6a29f2a7a63b28072830114caa1e49a79f4be7671f9a10683fc66d7aa0306df54ff572abbc44d4f15dc09bf769c3477ce8805579e414fbc6782d144b9dd009a94f0b0dda959e3ff7b429eea28a577f54155a0689e09d4e434b0043ccb3127b1aeab3ba20adab432c1fc50cd7121d79a1918ae96c8aa55dd8e1ed22c978db5a86d88359c8ce31b8d994"
        }
    ],
    "number": [
        {
            "id": 1,
            "title": "1",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F1.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/1.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=298ba30028e2ea9d1d594508c3977eb12ea6346e65903ab15da131aaaeb9afe12139fc43d3e852fe9d95a90c31ed26f0530d095a9b12b567900cb43e7ba0aabffd816a64ac0ada77638e443cd54b9fc1dd76fa5b797530bb54fe795b303a5b0fb93b88c804dd0c21b856662c6295a117ddfd92ecb5af96892c8eaaa19ba72e2bf56519f44c97e7a946c9d412aca98f7388b78b6d7bbaa156c771ee52c7764b4f41fae391316723a9efb995617ddbc9dbfef47eabd5e789b29ba5c250a6dbbd1f09e98137d9a7c639cea5228faf75f36611886a1554fce5eb3ef1043920018f9675e82a10a67a899dd4e2d6b4d2181cec00c7ad316602664f2a85a0cb7e95ab21",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F1.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/1.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=130e9a422bcfdd74012e86103a5bfc1247c1b584f6e1ca143ee1d57af16118199375be46231e4106efd86ef8fe52d3a1e73ecc111e800f36155dfecca20ca2c24ff08b1b3876e84f02b09ed62070aab727307babced752a663a017f1485c6718e0851c067bffcab6389fe65b2a0b27b46195791ae3ef9ddf6d5c38b9e823231ddce87db3761857a9615c6eb4206de4194846e4587f19e2c9cd7a8a068cf6b563abccc8bb08056f819208b479ee217f8e3c57dbdee9fe61f9c5c93412855cfd8d8a545e7914e618b239c10643897ed7a9bb1b4ccdb5052b95dc25888c80c8e9c424038c8c83dd7273254a76bbc3d51b63e823c95d615251433086eb6eac907097"
        },
        {
            "id": 2,
            "title": "10",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F10.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/10.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=40c7b74035ab08a412a71bf782c58cbde4bb0cc37cacc88c78e7f7f246f3ef46141b01dce41abc368eec81008dc7f06344d4ef33e29bb673830a909321342711860dd7a3143afe1cb1314b6a51fb44198cd8ec873fe9a5777155c9928f3e50dee205a19285cb5d779e3ea1ab908a75bbfb2228197ee05964620db3f184cc561ac87a0d86d8b6e5dfa8954e505ee4d1127436735bb61b30e70a36ba2dc99ee34a1685aaa671493dec8ec248bdba51adffe396c6f4f052a21455f468f72fb595fbef1e4201d82b86ed41ffa2cb85b6ba3b2990e5977803797449ea1f3b43a74d5843944a265ca4e2f55911ebbb57ae3f8d729997e94bacd9a4095c613d16ce317e",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F10.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/10.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=823651c15659201318c1409144fe0777144859e1c0d6b912fe4f74302e9f3c52271498f5d5416d4da4563f5de526fe08469645e32047302226ec02f566ce93f849152fd4313d4599bafddb25ba3037a9b45b7c2367b93c3b319e8351ed0ac0b609468c9c28a61cc6f5e2a6e635c907c82d48b492b1a7eed8dec16247dec635e5229c87542ad5fff009e811e58c47d0fd8578c6d3a997e29f95087d3c940f90823c2a69c1a5071716812650c5c0bb65c9c72310c915e8063a1a2ebc02fcae4b17fea5b112d16dbed02589ea0594fca203cab1083d7bc37b7be12973f811f421285cdd75ae3fbed147eda3ad69da39eea068660aa0068f5f1a491ace3eaeaf858c"
        },
        {
            "id": 3,
            "title": "2",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F2.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/2.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6f25abca4f2e28bbb3a84db799eaf52e11c2553dce2987d86c4b60367b082f9692fe59f9052044eef825b6fea5a94a048ce8b25da64ba451f3cea810bc7e944c8798eef6a49ac57c2515b9506ee76d7ffd7844a3a33f26ba9a906fe968b38eec066397da3b52ea006471ddfb76dd31fc14636a7f5f3b10e305bfeec128e20ed4685bc2506a621d8eb8e3b5dda1f3dd62858b5368c0216b6b2a2d0e3c3d1933febd8d45d6cda1a34a4bcd06f58b8a5a0ac855b7fa9bb3e11bc774e8db7be6eb05ccb9ba73ddb7cb4e87275f4594199cc9953e3ce008645b776ab048cff86ef5e5928dff2d2f3b2959d30f7e491ee16c9f758771332f5e294a72c05d7ab6ec96e0",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F2.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/2.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=769e036901834265f2c24f6f5c03e70281fd7327d434b908880909fe01c65786cfdae1ac8962ec7434df2a9b9a2497a933fc08e6206802bfb5d00d2b21df95765c4b98d407154a53efe16c9d3504e3c7a59163a8fa098ead35228a69ddcd96a9c30f7013c96d78c698b66cfea2eb2ae744bc6f7df40b9b11c7832775a42ea63dfeca3d0284648675f76d3f8c12d065bf0d9aa65a2657301277d1ebcd67e1b77e46fdda7d3ed4d6a8264bfc5406afe2e6002881badb00989a45db4a71e25bd0413d3bb3a54a66e0ae55c26d51fd7ad10a2c33762d657c3bd1ddb9fba0637416f6d318e74a5bc76cde0d7935b6338f9564883f7f1a4839680a5339d33c895a2ecb"
        },
        {
            "id": 4,
            "title": "3",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F3.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/3.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=30520df5ff1e6181ab6d1c277ef736f9f8d13936c9dff0b90b7c913ef17abec912040b4f81406614a76913e3875083cb0f7ecf2631e652d57df28cce3e3782dcbd954ae0e81a64bb17dccb2f0ae6940f4eba6c2beef713e370969f2301e7aea1e8b2f5367d78f3c127fcd0ec4a8e105ca7d3737c2446de64057971217ec4945837f504fd734de3faf11bca53e39cbfba45c8abea9186d7a8937daa8051568328483ddd2bcfc09a05a90d4a87c29d6f9253f2c7b49743a5b68f80fbbdf6ebbd089c5747aa78956a59946d6055701b273436085b1b4cf9e4d92db69078ebdde061f778f36844225bb2a61dbcec07b75b577ed46977ee1fc8e0d160827a949741a9",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F3.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/3.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=1162ac481ba28d3b28905f7b8b2bc6dd3502862f09dad4dcc8ce685ee6934161cf1f90107f025aa94601ec3aafa3c2e8053a36445568f76dd150e7c717d7afc04a78aeb3535e83102daeb3ddbee89967e8c0b37e89e6823e9db9f9f5da8816d2e521c2888d91ee5632cb3818c11a96ce11ee8cd93a30b8f0f8f93509e3c21deb01f3a319bf4ee6a1e666063cd9de48c8641c37973e5f91dc54b88aa25d7c41e56b303cd3da3f5ccb4ac894053b99f0bc49dfca5931ef1d10052603924f17175c38308d1bf42ae6aa48eb4aad6daa0b8791dd2798cbe7b317ed0b6a5eb66d5463e61223246554dca45ab7c8ae4a541bfcdbc93a3a24a23208a84c6af651bb8d17"
        },
        {
            "id": 5,
            "title": "4",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F4.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/4.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=90e8014a889eba72d6eaf82a91bbccf109b1dcd48e739e12ab5aeadbe064c82a73e84f8bac6ad0290b48729bb726d2d191e8c8c792e1801a62f71f99cdd3d0ee77021818fba3b659573df741e130dea028a43e020c44fbed3d7234633e78e4c8b878b1377d603c7e6bce5f1217f7408b3d2093f142e2fbf36d247720addbc5dc4a5e8e8a003b51eb17eea9651c1245554d507ff2b7a510b3b20b5449363c90e62c9d52c09be7ae7243e3209aabc905dc6b0d12fac5feb32cd29c3a7973be39ea78a8dc99545936b86f65e4b01d53aa4f8f89b5dad5e46acdb9098dbece0e4cf1bd8d9af9e8ad5151b71a39108a4b8e566eddadb1ceecfae627614f1cd2d3e277",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F4.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/4.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=863bb3767a47537c2aac92fdc60479a4c5f26be6662c749d468c2bb8bbc7997e365d1f26e3e3ac0a2b1bf4c028f85d89fd73ac61842fc3eff78caf639177d2451197e1e484e29704472b9f2a98cfc268875888d4905cf02c81eb54f379a05df23682d01e443dbc556a6af4780059bf38bbacebfbb0c85cbe95cca621ac758d77f7064aa144e6fd15401fdab3fc31b50de4dbd29228bac7075e1e234e7a868d98f239fb7641fff6985556b4d13770d9315b17dd96098fd260e12d5075a696a1893f0741a9e5bb38ce059c39f5fcf60335917f9dd4802fbdbbdb2577cb9df80bdcdfc8bcf7fb66fba7b6910111e529a81e39beb878d466473124b058e111700390"
        },
        {
            "id": 6,
            "title": "5",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F5.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/5.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=5787a4f1963f3680e50e6456715c0c3ac5d488a51ac0f2807b7368a193e8e00308aba9803b17b2b12a6cb68db32b061780912b6ad3a070108eac6b9781081de80ca32e219619d5c2145ee8788048a4cc536ddbfba67ba7799377d5af6e40b49216dff558d357c367936e7e5b562ef8e895f7aaf70d6fc06f88d7298a74cc2ee39802f23fbac887c2899af9329e9de9a13c366062076619d34cf3288681110c1c435ec0cd393708885efcd1e62e00d3a81d749f9de43f385486e2d38a6d58d5232e416151ab3907ed7725c8842a54c012854edec90927ec5fa63a8c36b4be04ac6ef062c7fc452e2ba46b77d6436b39f6340a224a2efbfb287293477c861588d1",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F5.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/5.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2ccf67a124ae9f2c7d66087493b727f8478fcb1cfffc97a5b3e6cee318711947f8426337f0a82c13bf98a3fc012fa2371afd545f03d2a8d02b02ae51fc9fe36ad8e234ff3e7194616e4d668bcba7b5ea1830b67632acd6e88d74c11a051ac017bb221f08d0d608f1f6e9dba08f19950ff54aecb1b9966920ca9643249136388b56e533be661cee44b0f685c93c9ece5c4316d3ffa11198516afebb9c55a6258e0f8d281f6a67718068e8fa66bc8393a68bf4916a54fce6b88985b9427f6ce4a4e7d050d082eda5de4e9663a09286419cb72d0e1e277d9bfa6f3188dee3ce9386a6508d5080f1a11e9fff384e24128b67100233bf776b89fa335c81b1221c3f1f"
        },
        {
            "id": 7,
            "title": "6",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F6.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/6.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=736570b49fcb8a86b1ef2691c8663c809bf38dada9d907d8b12cfc1cd9b050628f4f08772f7d7e15e9ee7c242feee9a5834b2d388ee4a23aa086faa0d44e61dc335b423b60db049ac1bf61c3cb8465ce58bed93f7944635f7ef1749e0531360329473c4a1047238b5d1b05a4525ef1e7c3a814f4ff060b7f5ececf2ff42e62fed120dd8f6cdb18164e21feeb72e7c49dd8988e4c2812d1a7a716758722c0896ac0420b940ee91814c4f0f6249970b3457ea9d71d62378c25960bf07bd5a6abfcfb45057a6b11d21c9a3ce15dcb3957972e9ced887f7f1a8d93e4c77f505884adfd274dc2300ae4bf73d6389f50098ed8b70c3f7b78b63d0244ec8b0ab7b0451b",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F6.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/6.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=3e19af34f3709bae7ea23e4a61cd80f2966f6dda8888d1f37faed9d07002d4f839f81417b6650a12ae5f39e3cb18b597ad5e7f50453a9d7de4bf1eb3452c0464ecb10a3de655f11cc422025f7389cff97a61ec113087e259cc73c229d8b29b99e6930cab431847885da5283c4ed8c0f9b2cf6d229adeb9bb83e88c8a4c5a40c36a736f638dacae8ab248e8287e32d7e7ecbfb330bcb91fc442cd905cadf9bf80e2de2891244372f016985672857ee56d93b379eb8ab02ff1f0f48be7e38098471fe3e25fb9e26b5bef6eebcb7a8debe32a33ec9a4ccfe81ca1e64dab8bc0ca7f887d71e10aa85551f352389ae6f43e88e2f718d76c2b23bbbfa88c72427c9edf"
        },
        {
            "id": 8,
            "title": "7",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F7.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/7.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6b3f86697651e18bc36c0c1de11687a214efd7db809fce01dc07b3dd86c4ed636ceb9c3522a195f8d0227ca2155817eb906b05d2e69ad19b9f676e6ae650a888940553b79dfddabc1ce0dfa5fe97f84200f022a854b2642ef8a5da17e8bd42c839906aa52ce81943bcafea4bda10efdff1b963b1249e7af07f8884d775f418459a0eafbdef48375a8f4ef152492760f3b7ce34bdabc977756729e917bf0665768d610ca8c27a6c9aa7464e68dc1c6e966799f917e5bbab307ae93797ab97ea052e2898ad707b8916d32987d341573e0b3d436e5521ab4a83aa5df3601441b5a17d6b5491bff814e4994cfe76e6160d5ff9d731199b8db2f0c43d03a0f9d89dce",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F7.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/7.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=752d07131a0b6211f13c9ad0b5277ecdee31f6460777a0b19c40d31d996489f9a0584ca2c6fe4f4e326e32e13ad83dba81ffaf00c3ebf489d6fe7e09b17910974c64dc29a1b1e289194486ebe7a05e8e2b771e0c522f4045add9b51b7699208ea0f806c41f65d41dcd6811434b93c571194c9f13ef2aefad9dece4bef992b3c4cc23e498046717e977873cfadbb4b91377723048435d61631599ebe5b489f6c6b64de9d674d5b4a6fb28b8761cba09f49171e45f5bf8e6b3164c0f42e2f7394e4c5180dfbacb38adbd6cc474092eaee67e460cfbb46ceef8d05e5ad3d7baf67cb49e56d1c95a77f6b9f38d7580887cd136187e4fa93f5b6559af85ecaa8687d8"
        },
        {
            "id": 9,
            "title": "8",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F8.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/8.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2295342a983e587e9513dda0ce418cc3539008b329fcfab2cc3ce25daa3b7e7367edda914f2c706da2e23db441ba6cb76b21878942f75ff5f172c87d2e9abbdaf4aa836ec96af86010546a3b3dcaafb3a494a5ca7d0cc312c8ff05cc10de68457bc2866856d5c2585cd26320207b070a6e5e7405e748caa63b83e0c7597cfb5d26603ae6d724af0378dbe3e3f2092cd71103927b437f153d65a7bff19ca591e6ee9a0e087312e6438bc4c9b8fcac3762fd80f4fb108a7dbfe783dc9e2e7ba34e4c7bd7e82258e8dfd2b2e98f46d0e653add419a6b4a9967e1bb66e857504d80dd8dfb076e781781507481cf5404ffe379c0bf3b5cc2eb648b1697529e202abdf",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F8.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/8.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9641bf347eed9df135127f3edf69a6825e4d93f595c009599feb793ebdb38d78c9e55b60de3b55702444a983a87f8446b79a50577c2b11d8419377672991e320a3edf22442a8240e6f20ce3fdd22aeff79c572f6ecc0846714b4fe49d45bca02328062a4d3fd7ec2e0418e75709209fd3e5e4d430d36203ba538c85ecc212aace908351e3924c9ea96d5abdaba0278e3f94b5a1d3667621d5a267e512842a0127480825c038147972a04c725a3594cd39d25b1558b54a1c07260bdf476ed60574f732f66b1fc946dc6291d6f7c1c0ffbd084c8d4af26e8fa284d4a01986e3c1b84a39c7fc3bc6058c83640c15cc9c1979ce9bdb024866714d2e3d0d4bec94432"
        },
        {
            "id": 10,
            "title": "9",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F9.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/9.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=97e938cf852fd9398b30fbdaf63fc0254bf7cc8364873beb2c7fa9428efbaf05e1bf58de9637cdbba958df61e177995e3f588825d165c1f137b2cb929bf6ea66cbbde696fee6d2eb260646d252f1fd4aebaca293b03f2574403fd2f984c1b1ac36cc2d68b538307cc8beebbb70eedadd078bb8cf80b19304a8d04a822e32eea352b0d904b230998f44c1860e3399c1d1c0e75b8f5eaa984bbac7de9b389228a96bd6541d04ffc9b1e582ed094e83ad70d98387fd9cba129263005fef4b5ece450036900d88e5b4d4dca01db66ef4df2a44a958c55abda6823292a9fbc3a102db88d61be2566b30919c61ff92546de1a435512601c762830d3c03ccdc5d9e8613",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2F9.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/9.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=229d849c7d2504268ec5a3a6a1671e7223dfe65d0438534b7bcbaab39d3091e11dfcdd446672dab495caf81a291076de2a26584fa4397e638fc0be1b137f83781f7440f913e81bb345e13a0e14843eb68b0017c7e537fd714fb2c715ba721de989ceed4d909d8601e2b5f1a8a119aa8af3c84012d64696fad317fb3cff14768ec234796169718b82538bf8184c3aab7bfed78881a9c4c1e34b4bd11b82c682a96be294d66ed35d36a2fb629d62b055049a530bbc726a1e3fb5c1d7ec00490f9e9705bf0225965a8040a3059ebb33e3e0b377fa230098fc62079b92774fba0cb6c20477293d1ff597c32fce5be06fbb37c09ac362bc66beb97d335223e7aab0f0"
        },
        {
            "id": 11,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        }
    ],
    "output_videos": [],
    "relationships": [
        {
            "id": 1,
            "title": "Blind",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlind.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blind.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9ec403a8b18c50919ac88346ffb9d173c4ddd3d6aaa1749cde3bd212012859e2755571d60a3343edd99ec64c0379903eb69134b3f0aa853a4d1767a205144ad757dc01f7cf98ae9728f768982b3d763424a743dc94b3ec9557e62366ab0fd8e71c058db7508027dfe31eb22701c4cc135dc409d0eb09b828021f922b1697dd7411ccc55945b659709675eb10037472e7cee07e3d1564ffad41df046682332c49180ed810ca9a056d2e09346b99b6b8faaf8e0f188b742c95fe082bf16628de9f06386f393e8ba282c3c0c1934febf26abc46050e85eb00fb0a65e840cad5cb152d70d72f9a5ff61733ebf0ea1f196a7228c79f8fad9a6cb332c323095844ea45",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBlind.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Blind.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=45a0d5daa857af07edeea3c81dc27f2f40dd6297711772c21b565223dba9312d208ad3e95dc9e5f6379bb4b124f7b68d7b503c3badcc68ca83d0bb9d5b6fbf4d88c9d1bfd35e08782454ec769446ab887bc407561f8e61e2fc116cf4d41691a8f4f5d7d7eda17f767e35643666c5df06e98fb8f48b08178e9e2921436e219b8f60026bc5290e786179e9c27f65beccb9ce7f81985e5bd613456bb9e5bcad37db6cbc426d7e3dde648c90e8896143906ea81e5a2443bfde33c57ad51a805443d2c157e80c9c9684a4629ec7b03a991fd3088a90ac235a2c22d556342ca4e056a72a3f88d04c3aafd2f05499868567e280829c311de6431c649fd2f12f1ac87d34"
        },
        {
            "id": 2,
            "title": "Boy",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBoy.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Boy.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=05b480272fb2b41d997e210e2a37e72f05b74b687e61b93d21d422edfc0fc6ae5c1bde017565ee3f11f51778b096adb0a88de4bc1ede23de9c02929af37ed10ef7586c0f27067b693ac162104432d20d9dd9871773f6c25c9c907b1c2ec396ae2114f7bf11578018f715d0a26771f50472c0c211e5edd829ad3bd8d03366d9d533359191638e983271d7e77f5cf9aea19e31655bf97a730aad56278c8377f887cecc0995895f85cb876bc9b18171c133997bd970613fec411ed85780eb6c3b3618289283672612ffd816e1dcd1d2cdb6f839ecf36881377c35dd928a6c21ecca4e850423e884d6084464eb402b00a8afc7cc1463377f87b50e45ab2cf56092f9",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FBoy.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Boy.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=9973fdc94ae91a3a2d0fdbd40c65265b654667c8100b301ce642332fadef62496262273f38a5018d07a5fe07f08352d9661a04e70d10fbca80224073e02a91a59daf9bf0a5fb0cbd7f0935b8c9a18e324a108a39dd6c6847f95dd8e9e33349adec422640d2066cf4ff0b16e5d480e95ff43d21f07c454aec3123dc39f8acdb0cf42af8ed8d1e30bed149db1fb24697ef96023cdccdf1641570e1e2f79972135bc241fe0cc116b7dbb5a4f655fb61ded280f6129205b01a66725f409579559777dcb59bceacee6bbd2a55f5a89493c68883cb99dbcd40f153a2889fb961cf26c96ae8b013eb5050ca652e7d275362d1b6e910677499f45cf375e903b0a3610332"
        },
        {
            "id": 3,
            "title": "Deaf",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=680ae6c1a529d4af5f16f3524046c3f663c28e8a5dcadcb0f28f027dcee7823f6a17215756c8e2f5802165af7daac61f7b3f71e3a2d5b9e4b1ea41473b2b201d49d372334a2462a241077a81d3e42c0597e9cb354bcb95663ebc15bc939c4fe08c30520cc50cc8275e3dc4484da31c728b5d75626d872f64f1fde2314284f3978c95777bab938f886bd3fa6a525c9e36926545533883ea232b6add15428ac7317050e1e2d59b835709c2f3f97329e6c5f22f19e11acbfd380b70fd3c2bda3e253fab19d3626f4e95922ba70eb4b41a60b499a4afe8cdea30a89341ce9f11f942c92078c10c4d96442017d0a5a5feeeb52a3e264fd29571ddb0cd94acdf51cd1a",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a3adcc3124400a522a95c592609957cef653aefc1c28ed6724654fb6ae8f31d0d74f63f2999d6df865a549f75a0812b68a09c3b98ee215ce5d1d27f2941146130e6cb4826cb03dbcbb4a1830ac20fb332ed0802d6c29e7da75f64a26a5ca7b7bf64fe72f235ceffbd79f45e80bdd2059cd19b22dac35693e18a830b07058cd659b77bf421c6f8e5c05005e120b358e6a8476f276ee2704881bce0b646c8fa8077b592148614365901df7d95065b2dd3e41105b60237b7715546e26d42e950dd533ea61a80ddcafb8b777551cfa9dbce8943780b55ac0601befc0ce785cb6e1e5837ceb141362b53c33e17f25b788f746c3e648ac0d7cfbac72ad04fa8f0cd4a2"
        },
        {
            "id": 4,
            "title": "Deaf Blind",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf+Blind.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf%20Blind.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=40fd84cdb9a8d8c63bbe5288c75d684783621acc4553cccacdeb8b7a9dc77f5fa717596ba92c6d2d193694b62d517a79a0f8b1b1caa1611a58534716a5390a206b8bb559b8eaba26d286ad6f22f8bb85548c3c200d5dcd63e8339ef9c919408456bd2e7725eb1c3af02cf99671d8bb9f02feca6733fe917d9f7afa8b70875a5feb2849ed4308c0d285e2a385defc09931b05a20a0f541f0b970644d27d9b57b0302f49a4149153ce308b13ab091f18539ef5dac3db447995015a3573dbe7b26d260ff1dcd6f5b1d21b6df1c2917b7aa17b29bcc84ab7e9f087619cc7179c8f9a70e68dcc4c92175e9757fce81198eff97a8acdae10944dbcdde23418e9d141dd",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDeaf+Blind.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Deaf%20Blind.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=651ddd435e68735d0c29c1a7ed140fb636ddd9ba74c78e8cc8f8c99801c5b4c4ead6bb19533b28047168d46f7ab96498657cfed64990af0072860e558bb890b42c6bb0abc224590d26cc972ea7a814c4e619c3339be83eb65e2d66e82f9e405ddce4fed958ba1d9fbe742228858c509c3624951072b9eac64110cb170783a5dc333f39065b311deda392fe9f6e9cecd66852aff29623a7f912696d2a3eddc8a385609618e80e3218dc762870841726ea6fe08b13445464cfe2976c381c0aa4e64082ba92726504e3b7cdf82f9b2cee542ba5dc21c2affe95584a163a12ea9fc7caf16d2530e76f550c0c5c67501169af9c9e0021a0b0ba8ea40c807bde9f1888"
        },
        {
            "id": 5,
            "title": "Girl",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGirl.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Girl.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=070e27a3bbd879d19f7a98c1a489f466145285caf9cb22bb43f9b7a275ee28aecb2ffb835f65acd2e2c19573e448f024e5cb2fc16370cb0ec4516498c9f6ee22b05ee6f8566ca9aa95b15be7719260a63f3a22b7b024f76dfd788f10b2c0cc4057f01117f04724d414165299c1c62c947609ca611e9e442caf709f1a0a254f8cbc489ca38be1de5c6a12417aa3f9ec60eb86b4c5e434128e4d17bc24cb0c6e7d635c955a8e5ee5723c715853b9974225d5b250fbe29cd31334487aa23321fb1e2fa0a544d270384bfff11b34866fd290fb4529f6ee12634484152d869b366ce284d561a93db63fa83b4d0bd7e523d38002d30059d0418da107beabc29d9620bd",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FGirl.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Girl.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2894f9bdc7c5611919c4e47beaf9d2f85fbdf644ca51f5a40f4fbc8e0efc53dbca37f161fb5f9ca3805a3e7b72289dc2b91098a8e2dff5e80632bc3ff56113917ca058e83cbbb48beab890166acd3f3d2cd6f8deb28adda7e28ed3927c9ef26f7b862014cafc2bc0d077ba94f5c1648cb47f7c4e0b0f46a70b257cf8fbb8818fd5103d34dae7dd22651a8f96eaba448a5cde175ec12c6857b3f241c5e191999a32f345381e20fe6a129d3ae47c4711d5809ebbd573b6936827a0879b39532a9585bd023631d8f01f0e0a71b6c7168086aaadbc9b2c0d6ad1546827c568ea57ff883431530e6d4b5b5ad87bee53c49110874f80cb6a2dfcbcfc3661407b835550"
        },
        {
            "id": 6,
            "title": "Hard of Hearing",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHard+of+Hearing.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hard%20of%20Hearing.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=0dfb8d3787d9beb458f687a9b99e8a606d3754517b3d13c8f0d36b31a26cb730aa0ad08e3ef3a1ab9aaed4900e9200598e5101dfa87870298c0a275670ad0798ba06417cfbe572e296d8ddbc32e7c411f99b3f79be34ae34cf2f82690b72ff59a14b4f93f6aefada2d8348c0632124eb3c84d9ed083c0455e8d4222641524631f8599ea23e27daefed6ae1b9e85f9e6d9bdee87f6b8bc46d03266ce75f796057d66fc70abd0a3c3e311769d9ed2fcf33cd355375a49565bbb55728b83eb3e41946c2a1e12d0e83be33155abefecff3a3ae14f468e3e1abd6a62028989666a0f3980e27770b2538a22e387097075693a3624e37573115ab73db184f025a89b494",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FHard+of+Hearing.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Hard%20of%20Hearing.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=30c2126da6dbf8118649f15acf78f5c74f9c5809807c18d1ee5da70b8c5c01313f83ddbdefcc132f91b6b68af3d3ca6e3a1cdaa21f3d8d37fa026f5915c376e05176a9d9ad1a1ea8c330ccf773585b9ba5689c5d485a07d021e14725166cab7daa7da10b8422bb17a704f620dc5004af1cbe2b357c0a327e9694377faa387254d5ea3b26ee1846179be2e32f8802347e5e8ae167fe2e5ad3ecde1aef5c615aac7e529147b5a03feb87c9c51148bd02e6812dbb82fe02f43e3b4825ed8cf3aaa977d14489803cb080092b12791e7dc69ce459a7cbc44dfe04e08e6a89ebbb686a34e3cbe1c809ad438322e2f4672a605846ffb09ef48b56272b5f3d91d9b49572"
        },
        {
            "id": 7,
            "title": "Married",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarried.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Married.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7dd95933120ff8c609698830cb3e407991c805acbb0c3e330993799970096361e1cc1437180eae1a5ca53df018da7d5e2a1a2af8545c5f95c5f8936cbea5f44a0bb3b12f9d6f4797bc7412471c7b743baf876938076601e2bc6f8f4b110453bc094da4986fcab916f536e853b09bbdb0783e2b017eba3c8112af54b9541ac84a8e69c68413ecefe61fa402ff12c6c3086b9ce9bebd6083405d7ab061f9e4929288d033db04af230eadf2e86ceae209f1f9211639ba10b801c04441ccc73e900499cd51e450aea8148eb5e40d6f8d55ce319fb0c0415063f4d571f6fb361d422c43c8b66584845ce03cf981df0c6321a6f522a7f624260ba5f1339cbc5f9881dc",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FMarried.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Married.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=84d6b7458ec24a6f1567344a7fddc4b64151cc2d1460419ea754f05f5b85b6bc30bb52da34f9df4de99773b6e3a2a38f3fbed495494243dc03d65e4c4d13c5f6f332751f4a357b85d105366ceb593c188f08dfbecec7c91a2fcfd7dd75ccc7cafe470b5f45284c22978c0ecfc1e19b6502d9b880f8905a698c47f9685d31421e1583a152420be55b7358e900c4d2010226e5adf12dd36d854b1eebf2e6b68e7366aa379d9581eeccc3a9535eec966a63cec4d5d7aca33f0e2b197498f7b3fb0bb1bc010bf75291d0091eed98ab8e746925ea4110572227c38f54f3e55ac3a2729ff48f5fbe837dcabb707d6a300bbebbe9347ce983d5564ad9ab3090bff7ff94"
        },
        {
            "id": 8,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 9,
            "title": "Woman",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWoman.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Woman.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=88b8fcb5852c6da6caed604dbe87d8557b4bfb40b4df3ee8e5b686cce80a59998b8c71c9f87076036598775afaea3aa911928899f275aa469af1c53016210ad4758854dab506d647ca41a4ae549b28b44b3bec4b7e91773ddf93731aa8adb24c114d84be9734f885f529b0faabe87f00303d5e677faec1d17cebfb94acceb230cff6c4582c416ef05faa3b7097a32226e4ff679b71146e9827008adc628b2ebb2921cf22b137e59a88a3c87abe68adfa87d5efc736106e0de2ff9a101094707caca38e84060e4f89ca3dc14e1ed7323262947b6ff17b9ffb9cbfadc092cc2695a9c0bab82425b434b4ea27a60e8e71492c388ada8d434a3e9c5d62cc06b5e3b9",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWoman.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Woman.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=2d440103ac83e644cac69e0597ceb3e5563b2c9d3b0bc5c8b7d0048dc372271cb419118dc80f0c3d7d38d3872937e6c1526228c5e1728a46661f03071a8a406349ce9d21477b59307f7e2cfb68d9ecefa271871e442b919f4ef9e2f13f5dd569e692f8d02634ecadddc2bddaed8c79023ac84727094a63202f8f95eb9b5e788f214cc3e7eef7fded038e71793674e51c2b0e3c8d95dcac660409f26f4bcffd2b46429610f55f17e3bab2244375cb52c3e5d1375756e235e8c6ccca2c5e343aa6d11511b64c5792a7b2c06e1d3bf4b491f10f274afa026b737f664ed4ecc9f266c1f285b350ca302c1a5cc9f90887186ef97fdb1d30e1d2d475c84a5fef582d5b"
        }
    ],
    "survival": [
        {
            "id": 1,
            "title": "Correct",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCorrect.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Correct.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=58cfd7ce2406ffb69a08483c4767e73a8dba51b17b051e2c2e5e4589ab5dac8049f0ef6a34aceff7bab14d12f7ea4a37caa75d06ac9e1aa2d82bc005d6be1cb0365fe091f44dae66a0876f632605903ef7fc46c7a6271c3169468e4819b3e7766bd72aae0c3e1f4de460e73cf3959a38ade4859feae14ebd2252a508218eb3282800e41ee8b92f0bd1c473dff0a0af28b8d2dbe0c68c0b1b13330890ec9d8aea20da69b15ee80dc423a2ee0d0647cb9a257a768868500ba4585e678a39eb3fa7d96b5badac83157b447297e80effe6ba062c2da7ddae5cb24bba5928123fec3dd3124a92059ee7c9db9539d19b7bee3dc21a32ac450528b05b0447cca6f23e70",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FCorrect.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Correct.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=513ebfaef031ec99eaff6825abd4900a257a9c649fbd3ec793c77c0d5e8d5d5b668e56fd8dbfc7342dd7d953de47a8fff9e2aeaace6bad99847a1a5f03a37c88f044292a76064d09d6fedc2271c8a90169ff71725f99eda9fe39c07c424bb26d4754bfb5f4159128c73b0ac3c7790aea65577a5d29b18af15b9822dab25fc5c04a4abb27d0ddabfb37233fbda0aba792b46261ba128e14c2f4eb107a84987f8cf9c86a830d916b3949fb12cfa8a3885af4c440a5555cda82229d56fd8de1df6b4917d41495270f4a48260dc47005fe2f22433e2a6ce0a1b8e950bde657434bebfd12cf79308636735f069071c749baf032c8729b0401f07c05dcd32c601fc649"
        },
        {
            "id": 2,
            "title": "Don_t know",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+know.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20know.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=8317078f72be446a85f0b2960462805f7b274d49fe377c38865267fdc19983c998c0020059f3c6efe345c8755023d7a7723a08202b103aa0fd072c5cc90766ed7b839d5eb71b2f95f8c8bb44b1788bbdc327693114fe52f6c63f4942a23951218890e859fcc581f4240e2adad03cbef66081fc2ac6221be31adeaa476db9bf736ac88d387937f24d8045add00fc44b86706ad28f44f87b5ac7a24fc630dcbb5a2adbe4c318643b1339cabd26fb4736bf0193c23e679429108633957e2849ad0caa5b8bd38618fabfc06f7739b23de045ab9642e93309e626b95716e8ce8ff0c4e5fdfadaace93d03e7efaff96c56393a836322d62fc0b8cbd043198b41c2d41c",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+know.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20know.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=a27682183bdce136f99ad8cfe841a1cdba848dabaa8150c02d2192c8b09bafed6844306eed8ccad6fafabdcd10b1732b6d3057af03ec474d26d2385314ee4c7756f78ab5e27c3146c2d3f83507b4956ea7029cdf7099b57b7bc9de7136773b21695aea776761fa3cb7571b2e6067ccc90206c487f27cf525a3fd632456be2a75e208078073d7e0d9b5024c449aab1610106eb833f4c3231f36afda447a824eb3064267d4ac1c80b1173699742a427c684a4f738e59239028283a3c8b579d74b7e54c4f453a20891dbe101659fe6747549095bc5622f99eeb1dc654c51ded131ab2b92064275d95b911696b0e42434ded9725d9dde785f0a4a985fb1c849b295e"
        },
        {
            "id": 3,
            "title": "Don_t understand",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+understand.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20understand.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=66ba5c2d309cffaca0e883ae21823497fe1f7108710de42b4e27d91d5fb7aba0389cb585229495f2bb350757c2bf5e18ea6d02515b3f6ed0832034456c5737ca80cd43d7998edb40f30f662818d4a8e3dafd7b50171e24bd30ae7933a64cae5f3b1a364ad3b42f6448b71a38e85ed70c1551fb53e5041d0362b7da91092c414adc52b08daf1fa5399a7f630cf8357febebafdf4a9c869e8ba4b0f65a3426cf843238d93648d7b622a2eda50f8fcf1a817cb8fd249159f0a11496b50b911b37e84db3ba4b71a3f0573f7e0dac41357b3a5937c2b465bc3df8148b4be91caa98e45d7feae878938b0c097bc036d7d895aca5c2f6474c6d7590e3480853e8cad936",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FDon_t+understand.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Don_t%20understand.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71633d9aa88b381b7b8e76f36e833f2c08d06d31994850f7c6f6473691419df2188e88c0daa55f171c3b6f551bde2cd4e9ce595cb5416f508c2658c6a6731d222f63e0229f2641accdd27d706720372d0ecf701eed1786db99283052df4b23e73534501783440c386cd00627b51ac8f5d9c9bc50d00426afd59fa4042e3496f73dcbb11ffa2abb71aef8cd0678fb0de980800b8e8db2a760f63d0da53336d54a29f9747c598319129d08114d47c3e0405ef7b94f63bcec124cf9c7307253433e2aa219d5542100c4b508d885b9c027c6a37e4d21f2485995b1763601556de81d1406fded1a684e2c058b86e4035c24bf3f6f0a5bede902835e6493fa49fdb52c"
        },
        {
            "id": 4,
            "title": "Fast",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFast.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fast.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=84c4b6e6bac9da6718640b99ba93cf45d2c6e4449548ad8c5dad25c8a18b5d3f3cb840e6842484e6067decae312d4b63a12c3a72c014371dc6022e2b1b94ab933192828a9d30cfef84e3602122cf17a304a7da647ed216fb111e619c09d5b74f3569e6bb4b2a71aed878fbf7ff934b1ace07da1c815b21cabb14cfc54bff3db8aa5addd90443f100da0dc5280c3b6914d4274c40b1d85bdf4def9ef5b2d14d3e6cbea005b20e17cb8018263d78b7d16cf5ff0d5db9f85da726201c124ff678564a309661da48d18ba4d2867a078234b2ed09ceda1e00be9d29d73b24b57791b4d8ec60acc7bd0ee4d57ac6d819356f30bf6b001a6414c06713b1512392884685",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FFast.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Fast.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=290116eb094e4d8c694fb8336ba942824c6625869e9c4a60b8ccbd025458d4b93a530bf9d1b4ae7e49fa9dcb98fd492ccf2d70cf6595c890381329d2d806252381efa1eadea5a677e97f75fc3fe6066159e224795475b53ac1495b4d2ebd097843b91a5848f38f22d12f9629a696090d262e1d9f266a6940ce3e41ef30841729a3ef2a764dd90b86614fb2dae99dda884f9ec50927353843166d430f8b1c28271c0ab6272ccd43423b9690f55eeb0167f1c66db7f2b5c777d8603873580cc29c5f5fee28ae81595aebb628cc5dc09a3c78e0ada78a3ff19d6faf4494f98e3be4eaa7e12178b103dda753a7f6fab927e385e7ce1d9e05b97bc927eeed2a564526"
        },
        {
            "id": 5,
            "title": "No",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=872d923d6b3fe00f1df3ff5108ca052972a242b4b4b8018c79150840a3c872786e752aae840752f479c2298ffe593433a8884815d0affc5b41c61bbe87aab8fbb08f9500f5a6d597d36f16f77b793477bc385f3c45c1c75a4a802c6d985d37165e26e5844489d214039e5a8d7d03b6c9aff74639c7a6679efe79758e51ce706060080d201cf7e24bab63d4d128fd4331f355fc7d3dc7760dc0c503093f222339d5bff5d64bf650a42c2a741c2398fd071ce6b35100df871e1fd557cd98a5d6c079283636f09e75162ebb26e38cae5a047061d1c5c3cc1779c497d9c7b42dee8e02098c199bb72670f4b85915f233682de6d2b69559338dd2f5a52aa0561e62d0",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FNo.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/No.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=19e3644e099f1d4e3dfb82a091daf7081f3047c84cd81b24e190719b29b883f4393a3d502c86c0a606080369eedc8520287787efde6c00d38b2673214202720441c55666da8326d3cde6a36f75225f976b311d5e07868926418996fc7421391be75aae825c917bfa73a79abd343cac6b6c0918d4fedbf28b144a297deff98987765365f26d85a4321e2d8dea3615ce541408dac0858962affb4967aa87ebb8d007833664a1965e916c9b9807039cfc4ebdfc6f0760b23a68cff8fa776563bc5b2106f8ede0fbc1c85c1037f7561e0a0706f7ee1b5125c0ca80a4584fb443e3dcd3408bd64506d1762388453673207ba4e686b93ad1bc05605af6b94b8485554c"
        },
        {
            "id": 6,
            "title": "output_images",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=47b14e0efe2a57e688149d7e2f15c6f14557b5e3f43245f17b92ae077562888ea1ffd99561330c27181f3f5f9396e722f60080f6f8eed61363b07fea153ed201fdd076b1789ecf7c26feeaa759ed5ab415a0e0edf27fd2ce7b8c11fea4e1ef0f03d528c0aa366a381ba05eba59a850fc6d6e5ab4fb7a16ff96a5699cdfa870edf9f11ca4351803f3b87d484f7240f0d6a7147a8be2caca0fc95863bed464e289605cf7044843c9f5821999e087be1eaf73b3098340c341125c9d4a356ddf08350f6a1d3e16627ba713bbfc0a3f7462f2e453e8dcf27e5d64a219259222356e9c9f5ba58296196db1898e3a929491833ad62584e482b492e870e2de8204a3e830",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2Foutput_images.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/output_images.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=71424bf84ee20310b598a0256b08f52942d6cb81ee7f3f2973dd6f4ab9935fa4c4d2ccd92112ea644ee776a8abb9fb984a45bbbda0ed7dc46077460fc309ab331218f958530fc1c3336d01dc2fdc266c5af4d7b9f8b3d94170f6d08853cf6e17a0a7f87be4c014a4b083c3858a75215ac9caff302f91199576e23140e20ef5ae4b1a70c510eb040aa9d8e8129c67624dd083e2a7f0423f766ca5ddbe92aa83c0bf1cafba7d30242c8143e32a9807baf6aada5e9f4d5cb54b06c45ec890ec580470fee5aaae911e211a406575d1014d61ed44f2a54b7a95e96e86417fbe613fb5145a230c295587fef29693aee55b9ff50d6384c6b9503a51c8a7c2b04e11b601"
        },
        {
            "id": 7,
            "title": "Slow",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSlow.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Slow.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=914f234b325e4c005d5e1617d58fac18be9e935c699f564486ab34355e04bf66f71c2504458021b2e1e27f2977b5923d382fe0d4b08d1aa631bdcb2c7e389a5129b3f28b16fc802cf87c9a986ba0b36c2fcaa6830771b51117693c0ccf65cfd23ce6f0766b7965f25cdafd216721566d039ee72b97907d58671646f19bac4a169838cb548c87e40e30a216e3791389a24d3bdbe8e3c22e6df39e6663ce00c7ed2ce65a2e213f79aeea5e885448bc98735562ce5c22aa4084d8a225941b3c4a8fd4c1270e14e4b3c439d82deb0df56b22aa6ce6be0a340d8b1b37a67f492d3981145ae100c7654e8d1e0f9d4c4ac6610a119d98ecd48d48ec8f29ca3bfc4be0d9",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FSlow.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Slow.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=242a8d22b316cc7e33f811d420a316cf71d3fd18bf6dc3d44b49027090a14dbb873414299b0c57e0a4ecf05f6db8eaf970807138b06bb807eb9dbd5d60abecbf5ca99dee5cea58c5b803420966b22356ca512d864d8d4ab6ec60fb908b8b4bc2f28d82c2c855d769d2f195615c5da8450d5c88c9e14d1295f7e56db5edc425184b25db257b5ea24b52379feb81991f5d971c67e8ef31793615f8f755948aa5fdd5748c55dd489dce1f29cf9e1cd34f811a0ee7e230721cffa8982dbfc81fd327b6105b8ea372cf4412d981f890aef723cac723d83f0e8a4597d6787461d7e00aa12367f162d03708d22470da76b81e193a0a1a35e88bff56d11e259649db5766"
        },
        {
            "id": 8,
            "title": "Understand",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUnderstand.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Understand.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=63738b84f521ce301ff7e14bd44d30ecf0019fdedbdb9fd7c4cbf70b96191e319eea01923bedf22519fe0bd6c70b7718370ff7ceb483a13cf5b4332d2cdeee793db0b1d863e026e15f5b38b5ed40058516e0697397d6ea92b3c6d1dd4cb1754d1e157659fb4cee8ac0f5d78b0b82cea23af99bd1e568c816eaa944283843b212d4298a624c697e1f22d692eed61cb2157ebe237b5f01cde29cfc26c67edf8683ad10ac18aa3b79c1e4c04bd4ca22232320c6876a08b636ae8a01143ab1321d7e336d8aa6092364d25ad03aab584e9d0779cd10e02a4008c5e90cc5eb7ea26fac2fe1b06614cc2feec6cb00bf8a40ead968552ebdbea2158ae522680a18f74627",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FUnderstand.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Understand.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=92e86bfc1516acefb94386dce7fa59f659acff1a6a6cfe30c7118f23ba7b3f855953042b5d8e8e737d7def1894792a5a3a8c1311079f6ed2b732695e24f1a47655522e3c2ab9fba50763d0b5fd80dfb90611d754e66193cbbc18b8701abb5d25be5a35bb73de70588f5b076b4d1f051597898a5c8019841b43dd5a53c6c9d7371f35a8bcac31e1961dc4953a517e7a27cc2cf09df41c303ba966ad07336b065a17da543611aeb9089d3fd64c8f05f903fd1c7d7f2e1bdcdd0d58849520a397d620b91a23a855b844a9f3e46d40f9580dd91b674244a5fdf6cfe1bd66e208c46efa11a7bc760ccec001170125899febe682da1efaeb988eb390855df530bec395"
        },
        {
            "id": 9,
            "title": "Wrong",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWrong.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wrong.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=52bb0260ea7f56c81aa82eeae1546bff416cc114f460b90817d5007f89e514859e4d50eca735d3d367c63a7a5a6208177eec4ff42504bd278cb740c2a60547618fa0033b9973ac2d284f0d26a435d466098f1bd9b82fb515fe9fa050498c3b0a02f5c964be2945aade7dcd28aaacf6989590c4ef05bfabc8bb67d07123b546089e37709ed86cc9e88d4775fc41be28b44a5754878554dda52956f18b609b3a5b1e687eb1f20affaed8a9eced0d262a2af7590e150be15780064665c617eb06331d66e00b979c55d5df779f4ec47bac31e428185024d26bba2f011d53c2288f1f72819a7d1fee40b11795c228cfdbcd10f2521c2484070949bd6c4b3256f77778",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FWrong.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Wrong.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=6d305b486b563b5dd6540198a73b6897f37bd1c48ba5c5d253bcd25cfde3f7275914033c4d9117be52e56ee70e8f2fdcf2957bbad3b005a97cc0da61a4adfd6b7fdff0211686806ad0e5f1291ef4f9318b4eeb89760dbc2f963a312931793fb9cb6dbfdc3c5aeebe47bbc71759addeccc7899036c8d1c67c8483c5ab05d57665ae8140519acceddc118e23dffabd0b2a1674db1bf5a975aa83739c08384ee80056927ccfe15f54ded3582d4d5d350105a4ca66aaa00532f6652cc6bc53f9ceb8fcab2363970a2d4e556ba9bf5a4fc7f1e81774169b7c922e426765f8e91b555f661f0a9b97a99911c16f6592e69fc5399144bed0bce60b8940aa670e8e642c0f"
        },
        {
            "id": 10,
            "title": "Yes",
            "videoUrl": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYes.MOV?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yes.MOV?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=17e91e7c4bba5439d53bad24ba53aebbd7181ba1eddb1ca38b257f25f40a32a2ba4414a262d89c205418f3099cbda0c41cae9a796876b81d0068ee0533c1614ca8c925ac28ab4066929a1f148154af7c621169feb7498a95320e485711fa0351a9bedd3b4ca3eca1a5669a5f5ed9efed3008690685d50fa9fd87d78f73b89152b329d5529debb59a994e91f6f4d40ee0b5159c159acf9f41dfa5e898032a833988c861bce0d404083bde860e0052684a7d93e1cb47d9d4a518e2fa65572fc0eb5dad8bd0f3935e940e0c27155db8bd19ab7eaf367de416865655d489d8d0e7b6881c9be509b6b6878f984b28baff1eed6c03612a4d5e1b53d3f78aaf71c625ca",
            "videoUrlBackUp": "https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/FSL_Videos%2FYes.mp4?alt=media&token=https://storage.googleapis.com/avdeasis-4b5c7.appspot.com/FSL_Videos/Yes.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-2k1rf%40avdeasis-4b5c7.iam.gserviceaccount.com%2F20241205%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241205T144321Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=61b1cb909a06e5b3a83fa539afc4a1031601c0645d473433cfc944c40ba4dc4e9778f1d8fac67905689a3f6ffd45868678c432a7f6d240ac6dfd0e79abad2600739dd82f1b41ba33a4cae7fc6d94a8326eeae46f43d7351ab951a207ac1ed2d19f99ae6e5538ebeb7bf709a95c679a0d7c621cc2f8a32349f526f36466ab0c41f7973a9fc5b8cad70a3237a43a51af6c83a28a61344d2e75b10da5ce63e0770dc37ea3dce2059b5f1d2ee53345e98d51a85492c0fb5e6710b8bd9f00e8d265d7c8ec6ff18edf8ca2876060e442630934814e514acc0e9298565136d161e3cc3ad3ec3f59f2145cf940c0a4168879a5be239cafd161aa3d46a2736fcf116e553f"
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
            <h1 className="text-2xl font-bold">Welcome to SignSwift</h1>
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
                            {sortedFilteredSubCategories.filter(i => i.title !== "output_images").map((subCategory) => {
                                let downloadURL = subCategory.videoUrl;
                                const handleError = (event) => {
                                    // If error occurs, attempt to use the backup URL
                                    event.target.src = subCategory.videoUrlBackUp;
                                };

                                const checkVideoUrl = (url) => {
                                    return fetch(url, { method: 'HEAD' })
                                        .then((response) => response.ok)
                                        .catch(() => false);
                                };

                                return (
                                    <div key={subCategory.id} className="p-4 rounded-lg shadow bg-gray-50">
                                        <h4 className="text-sm font-semibold mb-2">
                                            {subCategory.title}
                                        </h4>
                                        {!!downloadURL ? (
                                            <div>
                                                <video
                                                    controls
                                                    className="w-full"
                                                    onError={handleError}
                                                    src={downloadURL}
                                                    type="video/mp4"
                                                    onCanPlay={() => checkVideoUrl(downloadURL)}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        ) : (
                                            <p className="text-xs">No video available</p>
                                        )}
                                    </div>
                                );
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
                        {sortedFilteredSubCategories.filter(i => i.title !== "output_images").map((subCategory) => {
                            let downloadURL = subCategory.videoUrl;
                            const handleError = (event) => {
                                // If error occurs, attempt to use the backup URL
                                event.target.src = subCategory.videoUrlBackUp;
                            };

                            const checkVideoUrl = (url) => {
                                return fetch(url, { method: 'HEAD' })
                                    .then((response) => response.ok)
                                    .catch(() => false);
                            };

                            return (
                                <div key={subCategory.id} className="p-4 rounded-lg shadow bg-gray-50">
                                    <h4 className="text-sm font-semibold mb-2">
                                        {subCategory.title}
                                    </h4>
                                    {!!downloadURL ? (
                                        <div>
                                            <video
                                                controls
                                                className="w-full"
                                                onError={handleError}
                                                src={downloadURL}
                                                type="video/mp4"
                                                onCanPlay={() => checkVideoUrl(downloadURL)}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ) : (
                                        <p className="text-xs">No video available</p>
                                    )}
                                </div>
                            );
                        })}

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
