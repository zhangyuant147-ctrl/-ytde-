/** An original three-colour cut-paper illustration of two choices on a seesaw. */
export default function Balance() {
  return (
    <svg
      className="balance"
      viewBox="0 0 540 245"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#171717" />
        </pattern>
      </defs>
      <g
        stroke="#171717"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse
          cx="258"
          cy="220"
          rx="170"
          ry="7"
          fill="#171717"
          opacity=".12"
          stroke="none"
        />
        <path d="m260 166 29 52h-65z" fill="#A78BFA" />
        <path d="m265 178 22 38h-14z" fill="url(#dots)" stroke="none" />
        <path d="m74 187 365-55 2 9-365 56z" fill="#171717" />
        <g transform="rotate(-10 155 139)">
          <path d="m145 159 -7 22 -15 1m48-22 4 21 14 1" strokeWidth="6" />
          <path d="M108 132q-21 3-28-12m112 8 15-4 8-12" />
          <path
            d="m108 85 76-5q8 0 9 9l5 66q0 9-9 10l-77 4q-8 0-9-8l-4-65q0-10 9-11Z"
            fill="#171717"
          />
          <path
            d="m103 79 75-4q9 0 10 9l4 66q0 8-9 9l-75 5q-9 0-10-9l-4-64q0-10 9-12Z"
            fill="#A78BFA"
          />
          <path
            d="M100 146q40 5 90-10l1 16-89 7z"
            fill="url(#dots)"
            stroke="none"
          />
          <ellipse
            cx="126"
            cy="112"
            rx="6"
            ry="12"
            fill="#171717"
            stroke="none"
          />
          <ellipse
            cx="155"
            cy="110"
            rx="6"
            ry="12"
            fill="#171717"
            stroke="none"
          />
          <circle cx="128" cy="108" r="2.3" fill="white" stroke="none" />
          <circle cx="157" cy="106" r="2.3" fill="white" stroke="none" />
          <path d="m133 134 9-4 8 2" />
        </g>
        <g transform="rotate(9 366 89)">
          <path d="m347 120-4 18-12 3m49-23 8 13 12-2" strokeWidth="5" />
          <path d="m316 92-12-6-6-13m110 14 13-7 6-13" />
          <path
            d="m359 39 12 11 17-7 4 16 17 2-3 16 13 10-12 12 6 16-18 3-5 16-16-6-13 12-10-13-17 4-3-17-16-5 7-15-10-13 14-9-1-17 18 1z"
            fill="#FFD93D"
          />
          <path d="M343 82q6-9 13-2m17-2q6-9 13-2" />
          <path d="M347 94q18 4 33-3-9 29-33 3Z" fill="#171717" />
          <path d="m356 101 12-2" stroke="#FF5A36" />
        </g>
        <path d="m64 46 4 12 13 4-13 4-4 13-4-13-13-4 13-4z" fill="#FF5A36" />
        <path d="m466 101 3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#A78BFA" />
        <path
          d="m200 52 7-12m1 18 12-7M434 47l9-8m-6 16 11-3"
          strokeWidth="3"
        />
        <path
          d="M216 97c12-29 50-42 59-28s-13 28-18 16 20-31 44-30m-9-7 11 6-8 10"
          strokeDasharray="5 6"
          strokeWidth="2.5"
        />
        <path d="M80 177q-11-4-15-13m10 14-15-5" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
