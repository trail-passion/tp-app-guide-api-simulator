import React from "react"

export function Logo() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            version="1.1"
            viewBox="-60 -60 184 184"
            preserveAspectRatio="xMidYMid"
        >
            <defs>
                <linearGradient
                    id="j"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                    x2="64.5"
                    y1="32"
                    x1="-.372"
                >
                    <stop stop-color="#124000" offset="0"></stop>
                    <stop stop-color="#4fff00" offset="1"></stop>
                </linearGradient>
                <clipPath id="c">
                    <path d="m64.2 32a32.1 32 0 1 1 -64.2 0 32.1 32 0 1 1 64.2 0z"></path>
                </clipPath>
            </defs>
            <g stroke="none">
                <path
                    d="m64.2 32a32.1 32 0 1 1 -64.2 0 32.1 32 0 1 1 64.2 0z"
                    fill="url(#j)"
                    stroke="#000"
                />
                <g fill="#f70" stroke="#000" stroke-width="0.5">
                    <path d="m61.6 14.8c-4.15-2.7-19.1 4.56-24 4.89-7.89 0.526-25.3 0.57-23 15.1 3.91-6.03 8.89-10.8 19.4-11.9-1.22 4.98-12.3 9.83-12.3 11.8 0 2.52 5.54 2.38 7.08 1.22 4.14-3.12 7-8.55 9.36-12.7 5.62-1.22 8.94-0.688 13.8 0.651 2.11-3.88 3.41-6.9 9.69-9.04z"></path>
                    <path d="m35.9 30.3c-7.6 8.9-24.5 20.4-32.6 23.2 3.47 2.1 4.98 2.4 9.2 1.8 7.3-1.1 17.3-15.9 21.7-19.6 9.61-0.489 9.19 0.966 9.12 2.93-0.196 5.45-7.25 2.36-11.7 2.36-0.326 5.05-5.62 4.72-5.62 7.9 1.95-0.896 5.94-2.24 9.04-2.61 7.06-0.821 12.6-1.55 12.7-7.49 0.163-7.82-8.03-6.16-11.1-6.35-1.3-0.0814-0.0814-1.22-0.733-2.2z"></path>
                </g>
                <path
                    fill="#000e"
                    d="m43.8 9.45c-3.96-2.03-11.9 4.4-6.92 7.74 4.97 3.34 11.8-5.24 6.92-7.74z"
                ></path>
                <circle
                    fill="#fff"
                    clip-path="url(#c)"
                    opacity="0.4"
                    cx="0"
                    cy="0"
                    r="40"
                ></circle>
            </g>
        </svg>
    )
}
