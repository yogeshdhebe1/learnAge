# LearnAge - AI-Powered Education Platform

> A comprehensive role-based education management system enabling seamless collaboration between students, teachers, and parents with integrated AI tutoring capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.0-orange.svg)](https://firebase.google.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

LearnAge is a modern education platform designed to bridge the communication gap between students, teachers, and parents. The platform provides role-specific dashboards, real-time communication tools, AI-powered tutoring, and comprehensive academic management features.

### Problem Statement

Traditional education systems face several challenges:
- Lack of real-time communication between stakeholders
- Limited access to personalized learning support
- Inefficient attendance and homework tracking
- Difficulty in coordinating parent-teacher meetings

### Solution

LearnAge addresses these challenges by providing:
- **Unified Platform**: Single interface for all educational stakeholders
- **AI Integration**: 24/7 intelligent tutoring powered by Google Gemini
- **Real-time Communication**: Instant messaging and notifications
- **Automated Workflows**: Streamlined attendance, homework, and meeting management

---

## Features

### 👨‍🏫 Teacher Features

- **Dashboard**: Overview of class statistics and recent activities
- **Attendance Management**: Mark and track student attendance
- **Homework Assignment**: Create, assign, and track homework submissions
- **Student Management**: Add and manage students dynamically
- **Class Communication**: Post announcements and engage in class discussions
- **Meeting Coordination**: Review and approve parent meeting requests
- **Analytics**: View class performance metrics

### 🎓 Student Features

- **Dashboard**: Personalized overview of academic progress
- **Attendance Tracking**: View attendance history and statistics
- **Homework Management**: View assignments and submit completed work
- **AI Tutor**: Interactive AI-powered learning assistant
- **Class Chat**: Participate in class discussions
- **Profile Management**: Update personal information
- **Progress Monitoring**: Track academic performance

### 👨‍👩‍👧‍👦 Parent Features

- **Dashboard**: Overview of child's academic status
- **Attendance Monitoring**: Track child's attendance records
- **Homework Tracking**: Monitor homework assignments and completion
- **Meeting Requests**: Schedule parent-teacher meetings
- **Communication**: Stay informed through class announcements
- **Progress Reports**: View child's academic progress

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router | 6.20.0 | Client-side Routing |
| Axios | 1.6.0 | HTTP Client |
| Firebase SDK | 10.7.0 | Authentication & Database |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Programming Language |
| FastAPI | 0.104.1 | Web Framework |
| Uvicorn | 0.24.0 | ASGI Server |
| Firebase Admin SDK | 6.2.0 | Backend Services |
| Pydantic | 2.5.0 | Data Validation |

### Database & Services

- **Firebase Firestore**: NoSQL database for real-time data
- **Firebase Authentication**: User authentication and authorization
- **Google Gemini AI**: Conversational AI for tutoring

---

## System Architecture