const svgList = (type, labelColor) => {
  switch (type) {
    case 320:
      return `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="163">
 <path
  fill="#2b0f01"
  d="M45 1h32c4 0 5 1 7 4a3 3-36 0 1-1 3l-2 3a2 2 51 0 0 0 1l3 7 2 4c1 3 3 5 3 8v118a3 3 61 0 1-1 2l-1 7c-1 3-3 4-6 4H9c-3 0-5-1-6-4l-1-7a3 3-61 0 1-1-2V31c0-3 2-5 3-8l2-4 3-7a2 2-50 0 0 0-1L7 8a3 3 36 0 1-1-3c2-3 3-4 7-4h32Z"
 />
 <path fill="#ffffff" d="M80 6a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2 2 2 0 0 1 2-2h66a2 2 0 0 1 2 2Z" />
 <path
  fill="${labelColor}"
  d="M79 17a1 1 0 0 1-2 1H12a1 1 0 0 1-1-1 1 1 0 0 1 1-2h65a1 1 0 0 1 2 2ZM8 23v-1a1 1-79 0 1 1 0l7-2h16a1 1-44 0 0 1 0h3a1 1 46 0 0 1 0h3a1 1-42 0 0 1 0l5 1 2-1a1 1-47 0 0 1 0h3a1 1-40 0 0 1 0h7l3 1h5l7-1c2 0 5 1 6 3a1 1 85 0 1-1 1l-1-1a2 2 56 0 0-1 0H8ZM84 151H6a2 2 89 0 1-2-2V31q0-4 4-5a3 3-52 0 1 1 0h68l6 1q3 1 3 5v113l-1 5a1 1 14 0 1-1 1Z"
 />
 <path fill="#ffffff" d="M84 157a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2 2 2 0 0 1 2-2h74a2 2 0 0 1 2 2Z" />
</svg>
    `;
    case 500:
      return `
  <svg xmlns="http://www.w3.org/2000/svg" width="90" height="281">
 <path
  fill="#151209"
  d="M25 29V8l1-5a2 2 0 0 1 1-1l8-1h22c7 0 8 5 8 12v14l-1 4-2 5a2 2-42 0 0 0 2l5 4 10 4q10 7 11 19v46a4 4 36 0 0 0 1v39l1 19v31a1 1-29 0 1 0 1l-1 1v66q0 3-3 7c-4 6-10 4-16 2a4 4-17 0 1-1-1l-5-4a2 2 41 0 0-3 0l-5 6a3 3-68 0 1-3 1H37l-3-1-3-5a2 2-5 0 0-1-1l-3 1c-7 4-15 10-22 2-4-4-4-10-4-17V75l1-13q2-9 10-15l14-7c3-2 2-4 1-6l-2-4a1 1-73 0 0 0-1Z"
 />
 <path
  fill="#f1f2ef"
  d="M29 6a1 1-89 0 1 1-1h28a3 1-1 0 1 3 1v12a3 1-1 0 1-3 2H30a1 1-52 0 1-1-1V6ZM29 27a1 1 45 0 1-1-1v-1a3 1 0 0 1 2-1h29a3 1 0 0 1 2 1v1a1 1 90 0 1-1 1H29ZM32 31h2v1h-2v-1ZM49 32H35v-1h14v1ZM51 31h1l2 1h-2l-1-1ZM59 41H29l4-4a4 4 22 0 1 3-1h20a1 1-13 0 1 1 1l2 4Z"
 />
 <path fill="${darkenHex(
   labelColor
 )}" d="m59 41 7 4 10 4q5 4 7 10c2 4 2 7 2 11v27H5V67q0-8 5-14c3-5 8-7 14-8q3-1 5-4h30Z" />
 <path fill="${labelColor}" d="M85 97v94a2 2-55 0 1-1 0H9l-4 1V97h80Z" />
 <path fill="${darkenHex(
   labelColor
 )}" d="M85 191v74c0 5-1 10-6 12a2 2 40 0 1-2 0c-5-1-10-5-15-7a2 1-38 0 0-1-1l-3 2-4 4a5 5-72 0 1-4 2H39a4 4 74 0 1-3-2c-2-2-3-5-6-5q-3-1-5 1-7 5-13 6a3 2 42 0 1-1 0q-4-1-5-4l-1-11v-70l4-1h75a2 2-55 0 0 1 0Z" />
</svg>
`;
    case 1000:
      return `
  <svg xmlns="http://www.w3.org/2000/svg" width="138" height="408">
 <path
  fill="#18170b"
  d="m131 379-1 1h1l5 7c1 8-3 17-10 20a4 4 35 0 1-1 0H13c-5-2-7-4-9-9l-2-9c0-4 2-6 5-8a1 1 42 0 0 0-2q-3-2-4-6a3 3-54 0 1 0-1v-19c0-4 1-6 4-9q2-2 0-4v-1a2 2 16 0 0-1-1l-2-2a3 3 22 0 1-1-3v-20c0-4 1-6 4-8q2-1 1-4l-3-4-2-5v-20l1-3a3 3 82 0 1 1-1l3-4c0-3 0-4-2-5-2-3-3-4-3-8v-17c0-3 1-6 3-7a2 2-8 0 0 2-2q1-5-1-9l-4-17q-2-6-2-13v-74q0-9 3-16 4-9 10-16 14-20 36-34a4 4 76 0 0 2-3l-1-9-2-8V9c0-6 4-8 10-8h25q2 0 4 4l1 7v16a1 1-36 0 1 0 1l-3 8c0 3-1 8 2 9 21 13 39 32 48 56l1 6v85l-1 3-6 22v7a2 2-84 0 0 1 1q4 2 4 7v20q0 5-4 7a2 2-85 0 0-1 0c-1 2 0 4 2 6l2 2a4 4-68 0 1 1 3v16c0 5 1 9-3 12-3 2-3 5 0 7 2 1 3 4 3 7v20l-1 4a2 2-88 0 1-1 0l-2 2a1 1 78 0 0-1 1l1 4c2 2 4 4 4 7v22a3 3 68 0 1-1 2l-3 4Z"
 />
 <path fill="${darkenHex(
   labelColor
 )}" d="M85 19a1 1 14 0 1-1 1q-3-2-7 0h-6a6 6-47 0 0-2 0H59l-5-1a1 1-79 0 1-1-1V7a2 2-6 0 1 2-2h28a2 2 0 0 1 2 2v12ZM53 26v-1a1 1 37 0 1 1-1h30l2 1a1 1 17 0 1-1 2H54a1 1 38 0 1-1-1Z" />
 <path fill="#f5f7f1" d="m99 59-19-1H40l10-7c3-3 5-4 6-8v-6a1 1 89 0 1 1-1h24a1 1 90 0 1 1 1c0 4 0 6 2 9q0 2 3 3l12 10Z" />
 <path fill="${darkenHex(
   labelColor
 )}" d="M40 58h40l19 1 7 5 5 6q10 9 17 23 4 6 5 12l-9-1-3 1a7 6-52 0 1-2 0H5l2-8 3-3 1-4q9-15 24-28l5-4Z" />
 <path fill="${labelColor}" d="M133 105v92l-10-2h-6l-10 1H6l-1-9v-82h114a7 6-52 0 0 2 0l3-1 9 1Z" />
 <path
  fill="${darkenHex(labelColor)}"
  d="m133 197-7 22v5c0 4 1 4 4 6a4 4 15 0 1 2 4v17l-1 4a1 1 11 0 1-1 1c-5 1-4 6-4 10a1 1 16 0 0 1 1l4 4a2 2 19 0 1 1 2v19a3 3 75 0 1-1 3l-5 2a1 1-15 0 0 0 1v7a2 2 21 0 0 1 2l3 2a4 4 13 0 1 2 3v21a2 2 75 0 1-1 1l-5 3a1 1 76 0 0 0 1v6a4 4 18 0 0 1 3l4 2a2 2-72 0 1 1 2v20a3 3 75 0 1-2 3l-3 2a1 1-10 0 0-1 1c-1 3 0 5 2 6 2 2 4 3 5 6a2 2 46 0 1 0 1l-2 7c-3 7-6 7-13 7H18l-6-1c-4-2-6-8-6-13v-3l5-5a2 2 81 0 0 1-1v-4a1 1 6 0 0-1-1c-3-1-5-2-5-6v-15l1-5 4-3a2 2-9 0 0 1-1v-6c0-4-2-4-5-6a2 2 14 0 1-1-1v-20a4 4 75 0 1 2-4l3-2a2 2-15 0 0 1-1v-7c0-4-4-3-6-5a2 2 29 0 1 0-2v-20a3 3 75 0 1 1-2l3-2a3 3 75 0 0 2-3v-5a3 3-75 0 0-1-3l-3-1a1 1-2 0 1-1-1l-1-3v-20a2 2-15 0 1 1-1l4-3a2 2-14 0 0 1-2l-1-10-5-20h101l10-1h6l10 2Z"
 />
 <path fill="#f5f7f1" d="M7 344v-4q2 2 0 4Z" />
 <path fill="${darkenHex(labelColor)}" d="M131 379v1h-1l1-1Z" />
</svg>
`;
    case 2000:
      return `
  <svg xmlns="http://www.w3.org/2000/svg" width="143" height="408">
 <path
  fill="#060400"
  d="M101 397c-2-1-5-2-7 0-3 4-5 9-11 9H58a3 3 69 0 1-3-1l-7-9a2 2-28 0 0-3 0q-2 0-3 2l-11 7q-11 5-20-3-2-2-3-7-5-15-7-32V220q0-8 4-21 3-11 9-20l1-4q3-11 2-21l-3-8q-5-9-6-17l-1-16q0-8 3-15 5-11 14-19l13-9q13-14 17-33a6 6 39 0 0-1-4l-2-4a3 3-51 0 1 0-2l1-19c0-4 1-7 5-7h28c4 0 6 2 6 6l1 18c1 5-4 7-3 13 2 9 6 18 11 25l11 11 9 7c13 11 18 28 15 45q-1 11-5 18l-3 8c-1 7-2 15 0 22l5 9c5 9 7 19 9 30l1 11v134l-2 15-5 23q-2 6-9 10c-10 4-17-3-25-9Z"
 />
 <path
  fill="#ffffff"
  d="M56 19a1 1-34 0 1-1-1V7a3 3 90 0 1 3-3h27a3 3 90 0 1 3 3v11a1 1-39 0 1-1 1H56ZM87 23a1 1 45 0 1 1 1v1a3 2 0 0 1-3 2H58a3 2 0 0 1-3-2v-1a1 1 39 0 1 1-1h31ZM88 31a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1 1 1 0 0 1 1-1h32a1 1 0 0 1 1 1ZM89 48H54l3-12c0-2 1-2 3-2h24a2 2 87 0 1 2 2q0 6 3 12Z"
 />
 <path fill="${darkenHex(
   labelColor
 )}" d="M89 48q4 13 14 23l9 8q7 4 11 10c7 8 11 20 10 30l-1 7c-1 8-4 16-7 23-5 9-3 22 1 31l7 15q4 11 6 23H4l6-25 8-15a11 11 67 0 0 0-2l2-7 1-7q0-8-4-16l-6-20-1-11q1-13 7-23c5-7 11-12 18-16l8-8 7-10 2-5 2-5h35Z" />
 <path fill="${labelColor}" d="M139 218v87l-4-1H5l-1-3v-83h135Z" />
 <path
  fill="${darkenHex(labelColor)}"
  d="m139 305-1 42-1 21q-1 11-4 21l-2 8a3 3 76 0 1-1 1q-5 6-11 6-4 0-8-4l-12-8-3-1a2 2-71 0 0-1 1l-6 7-6 4a3 3 32 0 1-1 0H64q-6 0-8-2a8 4 44 0 1-1-1l-5-6-1-2a3 3-35 0 0-5 0l-2 1c-5 3-9 8-15 10h-4c-5 0-7-1-10-4l-2-6-5-20-2-19v-46l1-4h130l4 1Z"
 />
</svg>
`;
  }
};

const darkenHex = (hex, percent = 20) => {
  let h = hex.startsWith("#") ? hex.slice(1) : hex;
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);
  const factor = 1 - percent / 100;
  r = Math.max(0, Math.min(255, Math.round(r * factor)));
  g = Math.max(0, Math.min(255, Math.round(g * factor)));
  b = Math.max(0, Math.min(255, Math.round(b * factor)));
  const toHex = (c) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

try {
  console.log(darkenHex("#invalid"));
} catch (e) {
  console.error(e.message); // Invalid HEX color.
}

export const createSvg = (type, color) => {
  return svgList(type, color);
};
