"use client";
import {useEffect,useMemo,useState} from "react";
const syllabus=["Indian Polity & Constitution","Indian History & Culture","Rajasthan History, Art & Culture","Indian Geography","Rajasthan Geography","Indian Economy","Rajasthan Economy","Science & Technology","Environment & Ecology","Current Affairs","Reasoning & Mental Ability","Public Administration","Ethics & Integrity","International Relations","Social Issues & Schemes"];
const defaults={model:"sarvam-30b",apiUrl:"",apiKey:"",ocrLang:"eng+hin"};
const uid=