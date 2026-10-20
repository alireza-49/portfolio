type Props = { className: string };
const Logo = (props: Props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 512 512'
      width='512'
      height='512'
      {...props}
    >
      <defs>
        <filter id='riso-texture' x='-10%' y='-10%' width='120%' height='120%'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.8'
            numOctaves='3'
            result='noise'
          />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.1  0 0 0 0.07 0'
            in='noise'
            result='coloredNoise'
          />
          <feComposite
            operator='in'
            in='coloredNoise'
            in2='SourceGraphic'
            result='texture'
          />
          <feBlend mode='multiply' in='texture' in2='SourceGraphic' />
        </filter>

        <pattern
          id='dot-grid'
          x='0'
          y='0'
          width='16'
          height='16'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='2' cy='2' r='1.2' fill='#e64833' opacity='0.18' />
        </pattern>
      </defs>

      <rect
        width='512'
        height='512'
        rx='32'
        fill='#fdf9f0'
        stroke='#1e284a'
        strokeWidth='8'
      />

      <rect
        x='24'
        y='24'
        width='464'
        height='464'
        rx='20'
        fill='url(#dot-grid)'
      />

      <rect
        x='40'
        y='40'
        width='432'
        height='432'
        rx='16'
        fill='none'
        stroke='#1e284a'
        strokeWidth='3'
        strokeDasharray='10 6'
        opacity='0.4'
      />

      <path
        d='M 32 40 L 48 40 M 40 32 L 40 48'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <path
        d='M 464 40 L 480 40 M 472 32 L 472 48'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <path
        d='M 32 472 L 48 472 M 40 464 L 40 480'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <path
        d='M 464 472 L 480 472 M 472 464 L 472 480'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />

      <g transform='translate(10, 12)' opacity='0.25'>
        <rect x='110' y='100' width='280' height='280' rx='28' fill='#1e284a' />
      </g>

      <g transform='translate(-6, -6)'>
        <rect
          x='116'
          y='106'
          width='280'
          height='280'
          rx='28'
          fill='#f59e0b'
          opacity='0.85'
        />
        <line
          x1='160'
          y1='106'
          x2='160'
          y2='386'
          stroke='#1e284a'
          strokeWidth='2'
          opacity='0.3'
          strokeDasharray='4 4'
        />
        <line
          x1='352'
          y1='106'
          x2='352'
          y2='386'
          stroke='#1e284a'
          strokeWidth='2'
          opacity='0.3'
          strokeDasharray='4 4'
        />
      </g>

      <rect
        x='110'
        y='100'
        width='280'
        height='280'
        rx='28'
        fill='#e64833'
        stroke='#1e284a'
        strokeWidth='7'
      />

      <path
        d='M 174 180 L 146 220 L 174 260'
        fill='none'
        stroke='#fdf9f0'
        strokeWidth='8'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />

      <path
        d='M 330 200 L 356 240 L 330 280'
        fill='none'
        stroke='#fdf9f0'
        strokeWidth='8'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />

      <path
        d='M 314 170 C 314 170 314 274 314 290 C 314 314 294 326 266 326 L 194 326 C 168 326 156 312 156 294'
        fill='none'
        stroke='#ffffff'
        strokeWidth='22'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      <path
        d='M 230 156 L 338 184'
        fill='none'
        stroke='#fdf9f0'
        strokeWidth='20'
        strokeLinecap='round'
      />

      <circle
        cx='236'
        cy='248'
        r='14'
        fill='#1e284a'
        stroke='#ffffff'
        strokeWidth='4'
      />
      <circle cx='270' cy='248' r='6' fill='#fdf9f0' />

      <g transform='translate(256, 428)' textAnchor='middle'>
        <text
          y='0'
          fontFamily='&#39;Space Grotesk&#39;, &#39;Vazirmatn&#39;, system-ui, sans-serif'
          fontWeight='900'
          fontSize='28'
          fill='#1e284a'
          letterSpacing='2'
        >
          CODOLOGY
        </text>
        <text
          y='22'
          fontFamily='&#39;Vazirmatn&#39;, system-ui, sans-serif'
          fontWeight='700'
          fontSize='14'
          fill='#e64833'
          letterSpacing='4'
        >
          استودیو کُدولوژی // چاپ دیجیتال و کد
        </text>
      </g>
    </svg>
  );
};

export default Logo;
