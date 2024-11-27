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
import { FaCamera, FaImage, FaHistory, FaInfoCircle, FaChevronUp, FaChevronDown, FaPause, FaPlay } from "react-icons/fa";

import ReactPlayer from 'react-player';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPalette, faCalendarDay, faCocktail, faUsers, faUtensils, faHandshake, faHashtag, faHeart, faVideo, faSurvivalKit } from '@fortawesome/free-solid-svg-icons'; // If using react-player for video
let startTime = "";

const categories = [
    {
        id: 1,
        name: 'calendar',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faCalendar,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 2,
        name: 'color',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faPalette,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 3,
        name: 'days',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faCalendarDay,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 4,
        name: 'drink',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faCocktail,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 5,
        name: 'family',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faUsers,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 6,
        name: 'food',
        bgColor: '#FFCDD2', // Already matching
        icon: faUtensils,
        borderLeftColor: '#FF5252' // Already matching
    },
    {
        id: 7,
        name: 'greetings',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faHandshake,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 8,
        name: 'number',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faHashtag,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 9,
        name: 'relationships',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faHeart,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    },
    {
        id: 11,
        name: 'survival',
        bgColor: '#FFCDD2', // Updated to match 'food'
        icon: faVideo,
        borderLeftColor: '#FF5252' // Updated to match 'food'
    }
];


const subCategories = {
    "calendar": [
        {
            "id": 1,
            "title": "April",
            "videoUrl": "https://www.youtube.com/embed/April"
        },
        {
            "id": 2,
            "title": "August",
            "videoUrl": "https://www.youtube.com/embed/August"
        },
        {
            "id": 3,
            "title": "December",
            "videoUrl": "https://www.youtube.com/embed/December"
        },
        {
            "id": 4,
            "title": "February",
            "videoUrl": "https://www.youtube.com/embed/February"
        },
        {
            "id": 5,
            "title": "January",
            "videoUrl": "https://www.youtube.com/embed/January"
        },
        {
            "id": 6,
            "title": "July",
            "videoUrl": "https://www.youtube.com/embed/July"
        },
        {
            "id": 7,
            "title": "June",
            "videoUrl": "https://www.youtube.com/embed/June"
        },
        {
            "id": 8,
            "title": "March",
            "videoUrl": "https://www.youtube.com/embed/March"
        },
        {
            "id": 9,
            "title": "May",
            "videoUrl": "https://www.youtube.com/embed/May"
        },
        {
            "id": 10,
            "title": "November",
            "videoUrl": "https://www.youtube.com/embed/November"
        },
        {
            "id": 11,
            "title": "October",
            "videoUrl": "https://www.youtube.com/embed/October"
        },
        {
            "id": 12,
            "title": "September",
            "videoUrl": "https://www.youtube.com/embed/September"
        }
    ],
    "color": [
        {
            "id": 1,
            "title": "Black",
            "videoUrl": "https://www.youtube.com/embed/Black"
        },
        {
            "id": 2,
            "title": "Blue",
            "videoUrl": "https://www.youtube.com/embed/Blue"
        },
        {
            "id": 3,
            "title": "Brown",
            "videoUrl": "https://www.youtube.com/embed/Brown"
        },
        {
            "id": 4,
            "title": "Dark",
            "videoUrl": "https://www.youtube.com/embed/Dark"
        },
        {
            "id": 5,
            "title": "Gray",
            "videoUrl": "https://www.youtube.com/embed/Gray"
        },
        {
            "id": 6,
            "title": "Green",
            "videoUrl": "https://www.youtube.com/embed/Green"
        },
        {
            "id": 7,
            "title": "Light",
            "videoUrl": "https://www.youtube.com/embed/Light"
        },
        {
            "id": 8,
            "title": "Orange",
            "videoUrl": "https://www.youtube.com/embed/Orange"
        },

        {
            "id": 10,
            "title": "Pink",
            "videoUrl": "https://www.youtube.com/embed/Pink"
        },
        {
            "id": 11,
            "title": "Red",
            "videoUrl": "https://www.youtube.com/embed/Red"
        },
        {
            "id": 12,
            "title": "Violet",
            "videoUrl": "https://www.youtube.com/embed/Violet"
        },
        {
            "id": 13,
            "title": "White",
            "videoUrl": "https://www.youtube.com/embed/White"
        },
        {
            "id": 14,
            "title": "Yellow",
            "videoUrl": "https://www.youtube.com/embed/Yellow"
        }
    ],
    "days": [
        {
            "id": 1,
            "title": "Saturday",
            "videoUrl": "https://www.youtube.com/embed/Saturday"
        },
        {
            "id": 2,
            "title": "Thursday",
            "videoUrl": "https://www.youtube.com/embed/Thursday"
        },
        {
            "id": 3,
            "title": "Today",
            "videoUrl": "https://www.youtube.com/embed/Today"
        },
        {
            "id": 4,
            "title": "Yesterday",
            "videoUrl": "https://www.youtube.com/embed/Yesterday"
        }
    ],
    "drink": [
        {
            "id": 1,
            "title": "Beer",
            "videoUrl": "https://www.youtube.com/embed/Beer"
        },
        {
            "id": 2,
            "title": "Coffee",
            "videoUrl": "https://www.youtube.com/embed/Coffee"
        },
        {
            "id": 3,
            "title": "Cold",
            "videoUrl": "https://www.youtube.com/embed/Cold"
        },
        {
            "id": 4,
            "title": "Hot",
            "videoUrl": "https://www.youtube.com/embed/Hot"
        },
        {
            "id": 5,
            "title": "Juice",
            "videoUrl": "https://www.youtube.com/embed/Juice"
        },
        {
            "id": 6,
            "title": "No Sugar",
            "videoUrl": "https://www.youtube.com/embed/No Sugar"
        },
        {
            "id": 7,
            "title": "Sugar",
            "videoUrl": "https://www.youtube.com/embed/Sugar"
        },
        {
            "id": 8,
            "title": "Tea",
            "videoUrl": "https://www.youtube.com/embed/Tea"
        },
        {
            "id": 9,
            "title": "Wine",
            "videoUrl": "https://www.youtube.com/embed/Wine"
        }
    ],
    "family": [
        {
            "id": 1,
            "title": "Auntie",
            "videoUrl": "https://www.youtube.com/embed/Auntie"
        },
        {
            "id": 2,
            "title": "Cousin",
            "videoUrl": "https://www.youtube.com/embed/Cousin"
        },
        {
            "id": 3,
            "title": "Father",
            "videoUrl": "https://www.youtube.com/embed/Father"
        },
        {
            "id": 4,
            "title": "Grandma",
            "videoUrl": "https://www.youtube.com/embed/Grandma"
        },
        {
            "id": 5,
            "title": "Grandpa",
            "videoUrl": "https://www.youtube.com/embed/Grandpa"
        },
        {
            "id": 6,
            "title": "Mother",
            "videoUrl": "https://www.youtube.com/embed/Mother"
        },
        {
            "id": 7,
            "title": "Sister",
            "videoUrl": "https://www.youtube.com/embed/Sister"
        },
        {
            "id": 8,
            "title": "Uncle",
            "videoUrl": "https://www.youtube.com/embed/Uncle"
        }
    ],
    "food": [
        {
            "id": 1,
            "title": "Beverage",
            "videoUrl": "https://www.youtube.com/embed/Beverage"
        },
        {
            "id": 2,
            "title": "Bread",
            "videoUrl": "https://www.youtube.com/embed/Bread"
        },
        {
            "id": 3,
            "title": "Cheese",
            "videoUrl": "https://www.youtube.com/embed/Cheese"
        },
        {
            "id": 4,
            "title": "Condiments",
            "videoUrl": "https://www.youtube.com/embed/Condiments"
        },
        {
            "id": 5,
            "title": "Dessert",
            "videoUrl": "https://www.youtube.com/embed/Dessert"
        },
        {
            "id": 6,
            "title": "Dinner",
            "videoUrl": "https://www.youtube.com/embed/Dinner"
        },
        {
            "id": 7,
            "title": "Egg",
            "videoUrl": "https://www.youtube.com/embed/Egg"
        },
        {
            "id": 8,
            "title": "Lunch",
            "videoUrl": "https://www.youtube.com/embed/Lunch"
        },
        {
            "id": 9,
            "title": "Meat",
            "videoUrl": "https://www.youtube.com/embed/Meat"
        },
        {
            "id": 10,
            "title": "Noodles",
            "videoUrl": "https://www.youtube.com/embed/Noodles"
        },
        {
            "id": 11,
            "title": "Pizza",
            "videoUrl": "https://www.youtube.com/embed/Pizza"
        },
        {
            "id": 12,
            "title": "Rice",
            "videoUrl": "https://www.youtube.com/embed/Rice"
        },
        {
            "id": 13,
            "title": "Soup",
            "videoUrl": "https://www.youtube.com/embed/Soup"
        },
        {
            "id": 14,
            "title": "Sweets",
            "videoUrl": "https://www.youtube.com/embed/Sweets"
        },
        {
            "id": 15,
            "title": "Vegetables",
            "videoUrl": "https://www.youtube.com/embed/Vegetables"
        }
    ]
}

const CategoryCard = ({ category, setSelectedCategory }) => {
    return (
        <div
            className="p-4 m-2 rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-orange-70"

            // style={{
            //     background: `linear-gradient(to right, ${category.bgColor}, ${category.borderLeftColor})`,
            //     borderLeft: `6px solid ${category.borderLeftColor}`
            // }}
            onClick={() => {

                console.log("DEx")
                setSelectedCategory(category.name)
            }}
        >
            <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={category.icon} size="1x" color={category.borderLeftColor} />
                <h3 className="text-sm font-bold first-letter:uppercase">{category.name}</h3>
            </div>
        </div>
    );
};






const CategoryComponent = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    console.log({ selectedCategory });

    const toggleAccordion = (subCategoryId) => {

        console.log({ subCategoryId })
        if (activeSubCategory === subCategoryId) {
            setActiveSubCategory(null); // Close the accordion if already active
        } else {
            setActiveSubCategory(subCategoryId); // Open the clicked accordion
        }
    };

    return (
        <div className="space-y-4 p-3">
            {/* Banner Section */}
            {!selectedCategory && <h1 className="text-3xl font-bold text-muted">Welcome to SignSwift</h1>}

            {/* Category Cards Section - Only show if no category is selected */}
            {!selectedCategory && (
                <div className="grid grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            setSelectedCategory={setSelectedCategory}
                        />
                    ))}
                </div>
            )}

            {/* Show tutorials for selected category */}
            {selectedCategory && (
                <div className="bg-white rounded-lg shadow-xl p-4 space-y-6">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-sm text-blue-500 hover:text-blue-700 transition-all mb-4 inline-block"
                    >
                        &larr; Back to Categories
                    </button>
                    <h2 className="text-2xl font-bold text-gray-700">Video Tutorials for {selectedCategory}</h2>
                    <div className="space-y-6 mt-6">
                        {subCategories[selectedCategory]?.map((subCategory) => (
                            <div
                                key={subCategory.id}
                                className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-gray-100 to-orange-100 cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    onClick={() => toggleAccordion(subCategory.id)}
                                >
                                    <h3 className="text-2xl font-medium text-gray-800">
                                        {subCategory.title}
                                    </h3>

                                    {/* Accordion Icon from react-icons */}
                                    {activeSubCategory === subCategory.id ? (
                                        <FaChevronUp className="text-gray-600" />
                                    ) : (
                                        <FaChevronDown className="text-gray-600" />
                                    )}
                                </div>

                                <p className="text-gray-600 mt-2">{subCategory.description}</p>

                                {/* Accordion Content (Video) */}
                                {activeSubCategory === subCategory.id && (
                                    <div className="mt-4">
                                        <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
                                                src={subCategory.videoUrl}
                                                title={subCategory.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
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
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [gestureOutput, setGestureOutput] = useState("");
    const [gestureRecognizer, setGestureRecognizer] = useState(null);
    const [runningMode, setRunningMode] = useState("IMAGE");
    const [progress, setProgress] = useState(0);

    const requestRef = useRef();

    const [detectedData, setDetectedData] = useState([]);

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
            for (const landmarks of results.landmarks) {
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                    color: "#00FF00",
                    lineWidth: 5,
                });

                drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
            }
        }
        if (results.gestures.length > 0) {
            setDetectedData((prevData) => [
                ...prevData,
                {
                    SignDetected: results.gestures[0][0].categoryName,
                },
            ]);

            setGestureOutput(results.gestures[0][0].categoryName);
            setProgress(Math.round(parseFloat(results.gestures[0][0].score) * 100));
        } else {
            setGestureOutput("");
            setProgress("");
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
            const data = {
                signsPerformed: outputArray,
                id: uuidv4(),
                username: user?.name,
                userId: user?.userId,
                createdAt: String(endTime),
                secondsSpent: Number(timeElapsed),
            };

            dispatch(addSignData(data));
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
                        'https://firebasestorage.googleapis.com/v0/b/avdeasis-4b5c7.appspot.com/o/gesture_recognizer%20(3).task?alt=media&token=68dcbb0a-d793-49d1-aac2-525403d2ac24'
                },
                numHands: 2,
                runningMode: runningMode,
            });
            setGestureRecognizer(recognizer);
        }
        loadGestureRecognizer();
    }, [runningMode]);


    console.log({ accessToken })
    return (
        accessToken ? <>

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
                                videoConstraints={{
                                    facingMode: "user", // front-facing camera
                                }}
                                className="w-full h-full object-cover"
                            // className="signlang_webcam w-full h-full object-cover"
                            />
                            <canvas
                                ref={canvasRef}
                                className="signlang_canvas w-full h-full absolute top-0 left-0"
                            />
                            <button

                                className="border-2 border-gray-400 text-white rounded-full font-bold w-20 h-20 absolute 
                                left-1/2 top-[85%] transform -translate-x-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-400 flex items-center justify-center"
                                onClick={enableCam}
                            >
                                {webcamRunning ? (
                                    <FaPause className="text-xl" /> // Pause icon
                                ) : (
                                    <FaPlay className="text-xl" /> // Play icon
                                )}
                            </button>
                            <div className="mt-4  font-bold">
                                <p>Result: {gestureOutput}</p>
                                {/* <div className="w-full bg-gray-700 h-2 mt-2">
                                    <div
                                        className="bg-green-500 h-2"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div> */}
                            </div>
                        </div>
                    )}

                    {/* Practice and History Tabs */}
                    {activeTab === "practice" && <CategoryComponent />}
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


        </> : <div></div>
    );
};

export default Detect;
