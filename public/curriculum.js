const topics = [];

/* Mavzu fayli: Chegaralar (Borders)
   Yangi mavzu qoʻshish uchun shu formatda yangi fayl yarating (src/topics/ papkasiga).
   Tuzilishi: mavzu -> boʻlimlar (sections) -> qadamlar (steps).
   Qadam ikki xil boʻladi:
     dars  : { id, title, learn, example?, task, html, css, hint, tests }
     test  : { id, title, questions: [ { q, code?, options, answer, why } ] }   (answer = toʻgʻri variant raqami, 0 dan boshlanadi) */
topics.push({
  id: 'borders',
  title: 'Chegaralar',
  finish: 'Mavzu tugadi. Endi chegaralarni har tomonlama boshqara olasiz.',
  blurb: 'Qalinlik, rang va uslub, alohida tomonlar, yumaloq burchaklar, outline, box-sizing va jadval chegaralari.',
  thumb: '<i style="border:3px solid"></i><i style="border:3px dashed"></i><i style="border:5px double"></i><i style="border:3px solid;border-radius:50%"></i>',
  sections: [

    /* ================= 1-BOʻLIM ================= */
    {
      title: 'Chegara asoslari',
      blurb: 'Chegarani yoqish, qalinlik, rang va qisqa yozuv.',
      steps: [
        {
          id: 'border-style',
          title: 'Chegarani yoqing',
          learn: '<p>Har bir HTML element — toʻgʻri toʻrtburchak shaklidagi quti, va har bir qutiga chegara berish mumkin. Brauzer chegarani odatda <strong>oʻchirib</strong> qoʻyadi. Uni yoqish uchun <code>border-style</code> (chegara uslubi) ni tanlang.</p>',
          example: 'border-style: solid;',
          task: '<p><code>.box</code> elementiga yaxlit (<code>solid</code>) chegara bering.</p>',
          html: '<div class="box">Men qutiman.</div>',
          css: '.box {\n  padding: 24px;\n  background: #e6ecff;\n  /* Chegarani shu yerga yozing */\n}\n',

          hint: 'Chegaraning rangi va qalinligi uning ko‘rinishini yolg‘iz o‘zi belgilamaydi. <code>border-style</code> qiymatlaridan qaysi biri uzluksiz chiziq chizadi?',
          tests: [
            ['`.box` ning toʻrt tomonida ham `border-style: solid` bor', c => c.allSides('.box', 'style', 'solid')],
            ['Chegara koʻrinadi (qalinligi `0px` dan katta)', c => c.assert(c.px(c.side('.box', 'top', 'width')) > 0, 'Chegara uslub berilmaguncha koʻrinmaydi. `border-style: solid;` deb yozib koʻring.')]
          ]
        },
        {
          id: 'border-width',
          title: 'Qalinlikni tanlang',
          learn: '<p><code>border-width</code> chegara qanchalik qalin ekanini belgilaydi. Uzunlik qiymatlari oʻlchov birligi bilan yoziladi. Eng koʻp ishlatiladigan birlik — <code>px</code> (piksel).</p><p>Qalinlik berilmasa, brauzer <code>3px</code> ni oladi.</p>',
          example: 'border-width: 8px;',
          task: '<p><code>.box</code> da yaxlit chegara allaqachon bor. Uning qalinligini <code>8px</code> qiling.</p>',
          html: '<div class="box">Men qutiman.</div>',
          css: '.box {\n  padding: 24px;\n  background: #e6ecff;\n  border-style: solid;\n}\n',

          hint: 'Chiziqning uslubini saqlang. Uning qalinligini qaysi xossa boshqaradi? O‘lchov birligini ham yozing.',
          tests: [
            ['`.box` chegarasi toʻrt tomonda ham `8px` qalin', c => c.allSides('.box', 'width', '8px')],
            ['Chegara hamon `solid`', c => c.allSides('.box', 'style', 'solid')]
          ]
        },
        {
          id: 'border-color',
          title: 'Rangni tanlang',
          learn: '<p><code>border-color</code> har qanday CSS rangini qabul qiladi: <code>tomato</code> kabi nom, <code>#4169e1</code> kabi hex kod yoki <code>rgb(65, 105, 225)</code>.</p><p>Rang berilmasa, chegara matn rangini oladi.</p>',
          example: 'border-color: tomato;',
          task: '<p><code>.box</code> chegarasining rangini <code>royalblue</code> qiling.</p>',
          html: '<div class="box">Men qutiman.</div>',
          css: '.box {\n  padding: 24px;\n  background: #e6ecff;\n  border-style: solid;\n  border-width: 6px;\n}\n',

          hint: 'Qalinlik va uslub allaqachon berilgan. Faqat rangni o‘zgartiradigan chegara xossasini toping.',
          tests: [
            ['`.box` chegarasi toʻrt tomonda ham `royalblue` rangda', c => c.allSides('.box', 'color', 'royalblue')],
            ['Chegara hamon `6px` qalin va `solid`', c => { c.allSides('.box', 'width', '6px'); c.allSides('.box', 'style', 'solid'); }]
          ]
        },
        {
          id: 'shorthand',
          title: 'Border qisqartmasi',
          learn: '<p>Bitta chegara uchun uch qator yozish juda koʻp. <code>border</code> qisqartmasi qalinlik, uslub va rangni bitta qatorda beradi, odatda shu tartibda: <strong>qalinlik, uslub, rang</strong>.</p>',
          example: 'border: 4px solid seagreen;',
          task: '<p><code>.box</code> dagi uchta alohida chegara qatorini oʻchiring va oʻrniga bitta <code>border</code> qatori yozing: <code>5px</code> qalin, <code>solid</code>, rangi <code>seagreen</code>.</p>',
          html: '<div class="box">Men qutiman.</div>',
          css: '.box {\n  padding: 24px;\n  background: #e6ecff;\n  border-width: 2px;\n  border-style: dotted;\n  border-color: gray;\n}\n',

          hint: 'Qalinlik, uslub va rangni bitta <code>border</code> deklaratsiyasida qanday birlashtirish mumkin?',
          tests: [
            ['Siz `border` qisqartmasidan foydalandingiz', c => c.assert(/(^|[;{\s])border\s*:/.test(c.src), 'Qatorni `border:` bilan boshlang.')],
            ['Chegara toʻrt tomonda ham `5px solid seagreen`', c => { c.allSides('.box', 'width', '5px'); c.allSides('.box', 'style', 'solid'); c.allSides('.box', 'color', 'seagreen'); }],
            ['Uchta alohida chegara qatori olib tashlangan', c => c.assert(!/border-(width|style|color)\s*:/.test(c.src), '`border-width`, `border-style` va `border-color` ni oʻchiring. Ularning oʻrnini qisqartma bosadi.')]
          ]
        },
        {
          id: 'quiz-basics',
          title: 'Chegara asoslari testi',
          questions: [
            {
              q: 'Quyidagi kodda chegara nega koʻrinmaydi?',
              code: '.box {\n  border-width: 4px;\n  border-color: red;\n}',
              options: ['`border-style` berilmagan', '`4px` juda yupqa', '`red` rangi chegara uchun mos emas', 'Selektor oldidagi nuqta ortiqcha'],
              answer: 0,
              why: 'Chegara faqat uslub (`solid`, `dashed` va h.k.) tanlanganda paydo boʻladi. Uslub berilmasa, qiymat `none` boʻladi.'
            },
            {
              q: 'Qaysi qator toʻgʻri yozilgan CSS deklaratsiyasi?',
              options: ['`border: 3 solid blue;`', '`border = 3px solid blue;`', '`border: 3px, solid, blue;`', '`border: 3px solid blue;`'],
              answer: 3,
              why: 'Qiymatlar vergulsiz, boʻshliq bilan ajratiladi, qalinlik esa oʻlchov birligi bilan yoziladi (`3px`).'
            },
            {
              q: 'Qaysi `border-style` qiymati chegarani koʻrsatmaydi?',
              options: ['`solid`', '`none`', '`dotted`', '`double`'],
              answer: 1,
              why: '`none` — chegara yoʻq degani. Brauzerning standart qiymati ham shu.'
            },
            {
              q: '`border-color` berilmasa, chegara qanday rangda boʻladi?',
              options: ['Qora rangda', 'Shaffof boʻladi', 'Oq rangda', 'Elementning matn rangida'],
              answer: 3,
              why: 'Standart qiymat — `currentcolor`, yaʼni elementning matn rangi.'
            },
            {
              q: '`border-width` ga qanday qiymat berish xato?',
              options: ['`2px`', '`10`', '`thick`', '`0.5em`'],
              answer: 1,
              why: 'Noldan farqli uzunlik oʻlchov birligisiz yozilmaydi: `10` oʻrniga `10px`. (`thick` tayyor kalit soʻz, `0.5em` ham yaroqli.)'
            }
          ]
        }
      ]
    },

    /* ================= 2-BOʻLIM ================= */
    {
      title: 'Tomonlar va uslublar',
      blurb: 'Bitta tomon, chegarani olib tashlash, boshqa uslublar va ikki-toʻrt qiymat.',
      steps: [
        {
          id: 'one-side',
          title: 'Bitta tomon',
          learn: '<p>Qutining toʻrt tomoni bor: yuqori (top), oʻng (right), pastki (bottom) va chap (left). Faqat bittasini bezash uchun <code>border-top</code>, <code>border-right</code>, <code>border-bottom</code> yoki <code>border-left</code> dan foydalaning. Ularning har biri ham qisqartma: qalinlik, uslub, rang.</p>',
          example: 'border-bottom: 3px solid teal;',
          task: '<p><code>.title</code> ga <code>3px</code> qalin, yaxlit, <code>teal</code> rangli pastki chegara bering (xuddi tagiga chizilgan chiziqdek). Boshqa uch tomonda chegara boʻlmasin.</p>',
          html: '<h2 class="title">Kosmos haqida</h2>\n<p>Venerada kun uning yilidan uzunroq.</p>',
          css: '.title {\n  padding-bottom: 6px;\n}\n',

          hint: '<code>border</code> emas, <code>border-bottom</code> dan foydalaning. Oddiy <code>border</code> toʻrt tomonni ham chizib yuboradi.',
          tests: [
            ['`.title` ning pastki chegarasi `3px solid`', c => { c.expectSide('.title', 'bottom', 'width', '3px'); c.expectSide('.title', 'bottom', 'style', 'solid'); }],
            ['Pastki chegara rangi `teal`', c => c.expectSide('.title', 'bottom', 'color', 'teal')],
            ['Yuqori, chap va oʻng tomonlarda chegara yoʻq', c => ['top', 'left', 'right'].forEach(s => c.expectSide('.title', s, 'width', '0px'))]
          ]
        },
        {
          id: 'no-border',
          title: 'Chegarani olib tashlang',
          learn: '<p>Baʼzi elementlarda chegara brauzerdan tayyor keladi. Tugmalar — eng yaxshi misol. Chegarani olib tashlash uchun <code>border: none;</code> (yoki <code>border: 0;</code>) deb yozing.</p>',
          example: 'border: none;',
          task: '<p><code>.btn</code> tugmasida brauzerdan kelgan qalin kulrang ramka bor. Uning chegarasini olib tashlang.</p>',
          html: '<button class="btn">Bosing</button>',
          css: '.btn {\n  padding: 10px 22px;\n  font-size: 16px;\n  background: #2d56f2;\n  color: white;\n}\n',

          hint: 'Tugmaning odatiy chegarasi brauzerdan keladi. Chegara uslublari orasidan chiziq chizmaydigan qiymatni izlang.',
          tests: [
            ['`.btn` ning hech bir tomonida chegara yoʻq', c => c.allSides('.btn', 'width', '0px')]
          ]
        },
        {
          id: 'styles',
          title: 'Boshqa chegara uslublari',
          learn: '<p><code>solid</code> — uslublardan faqat bittasi. <code>dashed</code> (uzuq chiziqli), <code>dotted</code> (nuqtali) va <code>double</code> (ikkilangan) larni ham sinab koʻring.</p><p><code>double</code> chegarada ikki chiziq koʻrinishi uchun kamida <code>3px</code> kerak.</p>',
          example: 'border-style: dashed;',
          task: '<p>Quyidagi qutilarning qalinligi va rangi tayyor. <code>.dashed</code> ga uzuq chiziqli, <code>.dotted</code> ga nuqtali, <code>.double</code> ga ikkilangan chegara bering.</p>',
          html: '<div class="demo dashed">dashed</div>\n<div class="demo dotted">dotted</div>\n<div class="demo double">double</div>',
          css: '.demo {\n  padding: 12px;\n  margin-bottom: 12px;\n  border-width: 4px;\n  border-color: #2d56f2;\n}\n\n/* Har bir qutiga oʻz border-style qiymatini bering */\n.dashed {\n}\n\n.dotted {\n}\n\n.double {\n}\n',

          hint: 'Umumiy qoida qalinlik va rangni belgilab turibdi. Endi har bir sinfga mos chiziq uslubini alohida tanlang.',
          tests: [
            ['`.dashed` da uzuq chiziqli chegara bor', c => c.allSides('.dashed', 'style', 'dashed')],
            ['`.dotted` da nuqtali chegara bor', c => c.allSides('.dotted', 'style', 'dotted')],
            ['`.double` da ikkilangan chegara bor', c => c.allSides('.double', 'style', 'double')],
            ['Ikkilangan chegara kamida `3px` qalin', c => c.assert(c.strokeMatches('.double', 'border-top-width', '3px', true), 'Ikkilangan chegarada ikki chiziq koʻrinishi uchun kamida `3px` kerak.')]
          ]
        },
        {
          id: 'values',
          title: 'Ikki va toʻrt qiymat',
          learn: '<p>Koʻp xossalar bir vaqtda bir nechta qiymat qabul qiladi. <strong>Toʻrtta</strong> qiymat soat strelkasi boʻylab ketadi: yuqori, oʻng, pastki, chap. <strong>Ikkita</strong> qiymatda birinchisi — yuqori va pastki, ikkinchisi — chap va oʻng.</p>',
          example: 'border-width: 2px 10px;          /* yuqori+pastki, chap+oʻng */\nborder-width: 2px 6px 10px 14px; /* yuqori, oʻng, pastki, chap */',
          task: '<p><code>.frame</code> chegarasini har tomonda har xil qiling: yuqori <code>2px</code>, oʻng <code>6px</code>, pastki <code>10px</code>, chap <code>14px</code>.</p>',
          html: '<div class="frame">Soat strelkasi boʻylab: yuqori, oʻng, pastki, chap</div>',
          css: '.frame {\n  padding: 20px;\n  border-style: solid;\n  border-color: #2d56f2;\n}\n',

          hint: 'To‘rtta qalinlik yuqoridan boshlanib, soat strelkasi bo‘ylab taqsimlanadi. Har bir o‘lcham qaysi tomonga tegishli?',
          tests: [
            ['Yuqori chegara `2px`', c => c.expectSide('.frame', 'top', 'width', '2px')],
            ['Oʻng chegara `6px`', c => c.expectSide('.frame', 'right', 'width', '6px')],
            ['Pastki chegara `10px`', c => c.expectSide('.frame', 'bottom', 'width', '10px')],
            ['Chap chegara `14px`', c => c.expectSide('.frame', 'left', 'width', '14px')]
          ]
        },
        {
          id: 'quiz-sides',
          title: 'Tomonlar va uslublar testi',
          questions: [
            {
              q: '`border-bottom: 2px solid red;` nima qiladi?',
              options: ['Elementning toʻrt tomoniga ham chegara chizadi', 'Faqat pastki tomonga chegara chizadi', 'Faqat yuqori tomonga chegara chizadi', 'Xato: bunday xossa yoʻq'],
              answer: 1,
              why: '`border-bottom` faqat pastki tomonni bezaydi. Toʻrt tomon uchun `border` yoziladi.'
            },
            {
              q: '`border-width: 5px 20px;` da `20px` qaysi tomonlarga tegishli?',
              options: ['Yuqori va pastki', 'Faqat oʻng', 'Chap va oʻng', 'Faqat pastki'],
              answer: 2,
              why: 'Ikki qiymatda birinchisi yuqori va pastki, ikkinchisi chap va oʻng tomonlarga beriladi.'
            },
            {
              q: '`border-width: 1px 2px 3px 4px;` da chap tomon necha piksel?',
              options: ['`1px`', '`2px`', '`3px`', '`4px`'],
              answer: 3,
              why: 'Qiymatlar soat strelkasi boʻylab: yuqori `1px`, oʻng `2px`, pastki `3px`, chap `4px`.'
            },
            {
              q: 'Elementning chegarasini olib tashlash uchun qaysi kod toʻgʻri?',
              options: ['`border: off;`', '`border: hidden-all;`', '`border: none;`', '`border-style: 0px;`'],
              answer: 2,
              why: '`border: none;` chegarani butunlay olib tashlaydi. Boshqa variantlar CSS da mavjud emas.'
            },
            {
              q: 'Qaysi chegara uslubida ikkita parallel chiziq koʻrinadi?',
              options: ['`dashed`', '`double`', '`dotted`', '`solid`'],
              answer: 1,
              why: '`double` ikki chiziq chizadi. Ikkalasi ham koʻrinishi uchun chegara kamida `3px` qalin boʻlishi kerak.'
            }
          ]
        }
      ]
    },

    /* ================= 3-BOʻLIM ================= */
    {
      title: 'Yumaloq burchaklar',
      blurb: 'border-radius, aylana, tabletka shakli va bitta burchak.',
      steps: [
        {
          id: 'radius',
          title: 'Yumaloq burchaklar',
          learn: '<p><code>border-radius</code> qutining burchaklarini yumaloqlaydi. Son qancha katta boʻlsa, burchak shuncha yumaloq boʻladi. U koʻrinadigan chegara bor-yoʻqligidan qatʼi nazar ishlaydi.</p>',
          example: 'border-radius: 12px;',
          task: '<p><code>.card</code> ning toʻrt burchagini <code>16px</code> radius bilan yumaloqlang.</p>',
          html: '<div class="card">Chiroyli kartochka</div>',
          css: '.card {\n  padding: 24px;\n  background: #e6ecff;\n  border: 3px solid #2d56f2;\n}\n',

          hint: 'Burchakning egilishini chegara qalinligidan alohida boshqarish mumkin. Radius oshsa, burchak qanday o‘zgaradi?',
          tests: [
            ['`.card` ning toʻrt burchagida ham `16px` radius bor', c => c.allCorners('.card', '16px')],
            ['`3px` chegara hamon joyida', c => c.allSides('.card', 'width', '3px')]
          ]
        },
        {
          id: 'circles',
          title: 'Aylana va tabletka',
          learn: '<p><code>50%</code> radius kvadratni aylanaga aylantiradi. Tabletka shaklidagi uzun va yupqa tugmada esa foiz oval uchlar beradi. Buning oʻrniga <code>999px</code> kabi juda katta piksel qiymatini yozing: burchaklar uchrashganda brauzer yumaloqlashni toʻxtatadi.</p>',
          example: 'border-radius: 50%;\nborder-radius: 999px;',
          task: '<p><code>.avatar</code> ni mukammal aylana, <code>.pill</code> ni esa uchlari toʻliq yumaloq tugma qiling.</p>',
          html: '<div class="avatar">AB</div>\n<button class="pill">Obuna</button>',
          css: '.avatar {\n  width: 120px;\n  height: 120px;\n  display: grid;\n  place-items: center;\n  background: #2d56f2;\n  color: white;\n  font-size: 36px;\n  font-weight: bold;\n}\n\n.pill {\n  margin-top: 16px;\n  padding: 10px 28px;\n  font-size: 16px;\n  background: white;\n  color: #2d56f2;\n  border: 2px solid #2d56f2;\n}\n',

          hint: 'Kvadratni doiraga aylantirish uchun radiusni tomon uzunligiga nisbatan o‘ylang. Uzun tugmaning uchlari tutashishi uchun qancha yumaloqlik yetadi?',
          tests: [
            ['`.avatar` — aylana (`border-radius: 50%`)', c => {
              c.CORNERS.forEach(k => { const r = c.radius('.avatar', k); c.assert(r.unit === '%' ? r.n >= 50 : r.n >= 60, '`.avatar` ning har bir burchagi uchun `50%` radius kerak.'); });
            }],
            ['`.pill` ning uchlari toʻliq yumaloq', c => {
              const h = c.q('.pill').getBoundingClientRect().height;
              c.CORNERS.forEach(k => {
                const r = c.radius('.pill', k);
                c.assert(r.unit === 'px' && r.n >= h / 2 - 0.5, '`.pill` burchaklarining piksel radiusi balandligining kamida yarmiga teng boʻlishi kerak. Foiz oval uch beradi. `999px` ni sinab koʻring.');
              });
            }],
            ['`.avatar` kengligi va balandligi hamon `120px`', c => c.assert(c.lengthMatches('.avatar', 'width', '120px') && c.lengthMatches('.avatar', 'height', '120px'), '`.avatar` ning kengligi va balandligini `120px` qoldiring.')]
          ]
        },
        {
          id: 'corners',
          title: 'Bitta burchak',
          learn: '<p>Har bir burchakning oʻz xossasi bor: <code>border-top-left-radius</code>, <code>border-top-right-radius</code>, <code>border-bottom-right-radius</code> va <code>border-bottom-left-radius</code>.</p><p>Toʻrt qiymatli <code>border-radius</code> qisqartmasi ham soat strelkasi boʻylab, yuqori chapdan boshlanadi. Chat xabarlarida koʻpincha bitta burchak oʻtkir qoldiriladi.</p>',
          example: 'border-radius: 20px 20px 20px 0;',
          task: '<p><code>.bubble</code> ning uchta burchagini <code>20px</code> bilan yumaloqlang, <strong>pastki chap</strong> burchagini esa oʻtkir (<code>0</code>) qoldiring.</p>',
          html: '<div class="bubble">Salom! Veb-sayt yaratamizmi?</div>',
          css: '.bubble {\n  display: inline-block;\n  max-width: 260px;\n  padding: 14px 18px;\n  background: #2d56f2;\n  color: white;\n}\n',

          hint: 'Radiuslar yuqori chap burchakdan boshlab soat strelkasi bo‘ylab beriladi. Qaysi burchak to‘g‘ri qolishi kerak?',
          tests: [
            ['Yuqori chap burchak `20px`', c => c.expectCorner('.bubble', 'top-left', '20px')],
            ['Yuqori oʻng burchak `20px`', c => c.expectCorner('.bubble', 'top-right', '20px')],
            ['Pastki oʻng burchak `20px`', c => c.expectCorner('.bubble', 'bottom-right', '20px')],
            ['Pastki chap burchak oʻtkir (`0`)', c => c.expectCorner('.bubble', 'bottom-left', '0px')]
          ]
        },
        {
          id: 'quiz-radius',
          title: 'Yumaloq burchaklar testi',
          questions: [
            {
              q: 'Kvadrat elementni aylanaga aylantirish uchun qaysi kod kerak?',
              options: ['`border-radius: 100;`', '`border-radius: 50%;`', '`border-circle: true;`', '`border-radius: 0;`'],
              answer: 1,
              why: '`50%` radius har bir burchakni tomon uzunligining yarmicha yumaloqlaydi, natijada kvadrat aylanaga aylanadi.'
            },
            {
              q: '`border-radius: 10px 0 10px 0;` da qaysi burchaklar yumaloq?',
              options: ['Yuqori chap va pastki oʻng', 'Yuqori oʻng va pastki chap', 'Barcha toʻrttasi', 'Hech biri'],
              answer: 0,
              why: 'Tartib: yuqori chap, yuqori oʻng, pastki oʻng, pastki chap. Demak `10px`, `0`, `10px`, `0`.'
            },
            {
              q: 'Uzun tugmaning uchlarini toʻliq yumaloq (tabletka) qilishning ishonchli usuli qaysi?',
              options: ['`border-radius: 50%;`', '`border-radius: 1px;`', '`border-width: 999px;`', '`border-radius: 999px;`'],
              answer: 3,
              why: 'Juda katta piksel qiymati burchaklar uchrashguncha yumaloqlaydi. Uzun tugmada `50%` esa oval uchlar beradi.'
            },
            {
              q: 'Chegarasiz elementga `border-radius` berilsa nima boʻladi?',
              options: ['Hech narsa boʻlmaydi, chunki chegara yoʻq', 'Xato chiqadi', 'Fon (background) burchaklari yumaloqlanadi', 'Element yoʻqoladi'],
              answer: 2,
              why: '`border-radius` fonni ham kesadi. Chegara boʻlmasa ham fon burchaklari yumaloq boʻladi.'
            }
          ]
        }
      ]
    },

    /* ================= 4-BOʻLIM ================= */
    {
      title: 'Outline va quti oʻlchami',
      blurb: 'Joy egallamaydigan kontur va chegara quti kengligiga qanday taʼsir qiladi.',
      steps: [
        {
          id: 'outline',
          title: 'Outline (tashqi kontur)',
          learn: '<p><code>outline</code> chegaraga oʻxshaydi, lekin u qutidan <em>tashqarida</em> chiziladi va joy egallamaydi, shuning uchun atrofdagi narsalar siljimaydi. Brauzerlar klaviatura fokusini koʻrsatish uchun outline ishlatadi.</p><p><code>outline-offset</code> quti bilan kontur orasiga boʻshliq qoʻshadi.</p>',
          example: 'outline: 3px solid orange;\noutline-offset: 4px;',
          task: '<p><code>.selected</code> ni <code>3px</code> qalin, yaxlit, <code>orange</code> rangli outline va <code>4px</code> <code>outline-offset</code> bilan ajrating. <code>border</code> ishlatmang: quti kattalashmasligi kerak.</p>',
          html: '<div class="item selected">Tanlangan</div>\n<div class="item">Keyingi quti</div>',
          css: '.item {\n  width: 200px;\n  padding: 12px;\n  margin-bottom: 14px;\n  background: #e6ecff;\n}\n\n.selected {\n}\n',

          hint: 'Tashqi chiziq bilan element orasidagi masofani ham tekshiring. Chiziqni chizish va uni siljitish uchun turli xossalar kerak.',
          tests: [
            ['`.selected` da `3px solid` outline bor', c => c.assert(c.strokeMatches('.selected', 'outline-width', '3px') && c.val('.selected', 'outline-style') === 'solid', '`outline: 3px solid orange;` dan foydalaning.')],
            ['Outline rangi `orange`', c => c.assert(c.val('.selected', 'outline-color') === c.color('orange'), 'Outline rangi `orange` boʻlishi kerak.')],
            ['Outline quti bilan orasida `4px` masofa bor', c => c.assert(c.strokeMatches('.selected', 'outline-offset', '4px'), '`outline-offset: 4px;` qoʻshing.')],
            ['`.selected` da chegara yoʻq', c => c.allSides('.selected', 'width', '0px')],
            ['Quti kattalashmadi', c => c.assert(c.q('.selected').offsetWidth === c.qa('.item')[1].offsetWidth, '`.selected` boshqa qutidan kengroq. `border` emas, `outline` ishlating.')]
          ]
        },
        {
          id: 'box-sizing',
          title: 'Chegara va quti oʻlchami',
          learn: '<p>Odatda <code>width</code> faqat <em>mazmun</em> kengligini oʻlchaydi. Ichki masofa (padding) va chegara tashqaridan qoʻshiladi. Shuning uchun <code>width: 200px</code>, <code>20px</code> padding va <code>10px</code> chegara bilan quti <code>260px</code> keng boʻladi.</p><p><code>box-sizing: border-box</code> qoidani oʻzgartiradi: kenglikka padding va chegara ham kiradi. Qanday oʻlcham yozsangiz, shunday oʻlcham olasiz.</p>',
          example: 'box-sizing: border-box;',
          task: '<p><code>.box</code> chegarasi bilan birga <code>200px</code> keng boʻlishi kerak, lekin u kengroq. Buni bitta yangi qator bilan tuzating. Kenglik, padding va chegarani oʻzgartirmang.</p>',
          html: '<div class="box">Men 200px keng boʻlishim kerak.</div>',
          css: '.box {\n  width: 200px;\n  padding: 20px;\n  border: 10px solid #2d56f2;\n  background: #e6ecff;\n}\n',

          hint: 'Berilgan kenglik ichiga ichki masofa va chegara ham sig‘ishi kerak. Qutining o‘lchamini hisoblash usulini qayerda tanlaysiz?',
          tests: [
            ['`.box` da `box-sizing: border-box` bor', c => c.assert(c.val('.box', 'box-sizing') === 'border-box', '`box-sizing: border-box;` qoʻshing.')],
            ['`.box` ning umumiy kengligi aniq `200px`', c => { const w = Math.round(c.q('.box').getBoundingClientRect().width); c.assert(w === 200, '`.box` ning umumiy kengligi `' + w + 'px`. U `200px` boʻlishi kerak.'); }],
            ['Padding va chegara oʻzgartirilmagan', c => c.assert(c.strokeMatches('.box', 'border-top-width', '10px') && c.lengthMatches('.box', 'padding-left', '20px'), '`20px` padding va `10px` chegarani oʻz holicha qoldiring.')]
          ]
        },
        {
          id: 'quiz-sizing',
          title: 'Outline va quti oʻlchami testi',
          questions: [
            {
              q: '`outline` va `border` orasidagi asosiy farq nima?',
              options: ['`outline` qutini kattalashtiradi, `border` esa yoʻq', '`outline` joy egallamaydi va qutidan tashqarida chiziladi', '`outline` faqat tugmalarda ishlaydi', 'Ular butunlay bir xil'],
              answer: 1,
              why: '`border` quti oʻlchamiga qoʻshiladi, `outline` esa tashqarida chiziladi va atrofdagi elementlarni siljitmaydi.'
            },
            {
              q: 'Quyidagi qutining umumiy kengligi qancha?',
              code: '.box {\n  width: 100px;\n  padding: 10px;\n  border: 5px solid;\n}',
              options: ['`100px`', '`110px`', '`130px`', '`120px`'],
              answer: 2,
              why: '`box-sizing` berilmagan, shuning uchun `width` faqat mazmun kengligi: 100 + 2×10 (padding) + 2×5 (chegara) = 130px.'
            },
            {
              q: 'Xuddi shu quti `box-sizing: border-box` bilan qancha kenglikda boʻladi?',
              code: '.box {\n  box-sizing: border-box;\n  width: 100px;\n  padding: 10px;\n  border: 5px solid;\n}',
              options: ['`100px`', '`130px`', '`115px`', '`110px`'],
              answer: 0,
              why: '`border-box` da `width` ga padding va chegara ham kiradi. Quti `100px` boʻlib qoladi, mazmun uchun 70px qoladi.'
            },
            {
              q: '`outline-offset: 6px;` nima qiladi?',
              options: ['Konturni quti ichiga suradi', 'Kontur qalinligini `6px` qiladi', 'Qutini `6px` kattalashtiradi', 'Konturni quti chetidan `6px` uzoqlashtiradi'],
              answer: 3,
              why: '`outline-offset` quti chekkasi bilan kontur orasidagi masofani belgilaydi.'
            }
          ]
        }
      ]
    },

    /* ================= 5-BOʻLIM ================= */
    {
      title: 'Jadval chegaralari',
      blurb: 'Jadval kataklaridagi qoʻsh chiziqni birlashtirish.',
      steps: [
        {
          id: 'tables',
          title: 'Jadval chegaralari',
          learn: '<p>Jadvalda har bir katakning oʻz chegarasi bor, shuning uchun qoʻshni kataklar yonma-yon ikkita chiziq chizadi. Jadvalga (<code>table</code>) berilgan <code>border-collapse: collapse</code> ularni bitta toza chiziqqa birlashtiradi.</p>',
          example: 'border-collapse: collapse;',
          task: '<ol><li>Qoʻsh chiziqlarni birlashtiring: <code>.planets</code> jadvaliga <code>border-collapse: collapse;</code> qoʻshing.</li><li>Sarlavha kataklariga (<code>th</code>) <code>3px</code> qalin, yaxlit pastki chegara bering.</li></ol>',
          html: '<table class="planets">\n  <tr><th>Sayyora</th><th>Yoʻldoshlar</th></tr>\n  <tr><td>Yer</td><td>1</td></tr>\n  <tr><td>Mars</td><td>2</td></tr>\n</table>',
          css: '.planets th,\n.planets td {\n  border: 1px solid #56617a;\n  padding: 8px 18px;\n}\n',

          hint: 'Avval qo‘shni kataklar orasidagi ikkita chiziqni birlashtiring. Keyin faqat sarlavha kataklarining pastki tomonini o‘zgartiradigan selektorni tanlang.',
          tests: [
            ['Jadvalda `border-collapse: collapse` bor', c => c.assert(c.val('.planets', 'border-collapse') === 'collapse', '`.planets` qoidasiga `border-collapse: collapse;` qoʻshing.')],
            ['Maʼlumot kataklari (`td`) `1px solid` chegarasini saqlagan', c => c.qa('.planets td').forEach(td => { c.expectSide(td, 'top', 'width', '1px'); c.expectSide(td, 'top', 'style', 'solid'); })],
            ['Sarlavha kataklarida (`th`) `3px solid` pastki chegara bor', c => c.qa('.planets th').forEach(th => { c.expectSide(th, 'bottom', 'width', '3px'); c.expectSide(th, 'bottom', 'style', 'solid'); })]
          ]
        },
        {
          id: 'quiz-tables',
          title: 'Jadval chegaralari testi',
          questions: [
            {
              q: 'Jadvalda kataklar orasida nega ikkita chiziq koʻrinadi?',
              options: ['Bu brauzer xatosi', '`border-style: double` avtomatik yoqilgan', 'Har bir katak oʻz chegarasini chizadi, qoʻshni chegaralar yonma-yon turadi', 'Jadval ikki qatlamdan iborat'],
              answer: 2,
              why: 'Har bir `td` va `th` oʻz chegarasiga ega. Qoʻshni kataklarning chegaralari yonma-yon chiziladi.'
            },
            {
              q: 'Bu qoʻsh chiziqni qanday tuzatamiz?',
              options: ['`table { border-collapse: collapse; }`', '`td { border-radius: 0; }`', '`table { box-sizing: border-box; }`', '`th { border-style: single; }`'],
              answer: 0,
              why: '`border-collapse: collapse` qoʻshni chegaralarni bitta chiziqqa birlashtiradi.'
            },
            {
              q: 'Bu kodda `th` ning pastki chegarasi qanday boʻladi?',
              code: 'th, td {\n  border: 1px solid gray;\n}\n\nth {\n  border-bottom: 4px solid black;\n}',
              options: ['`1px gray`', '`4px black`', 'Ikkalasining oʻrtachasi', 'Chegara yoʻqoladi'],
              answer: 1,
              why: 'Ikkala qoida bir xil kuchga ega, shuning uchun keyin yozilgani gʻolib boʻladi. `th` ning qolgan uch tomoni `1px gray` boʻlib qoladi.'
            },
            {
              q: 'Bu qutining chap chegarasi qanday boʻladi?',
              code: '.box {\n  border: 2px solid gray;\n  border-left: 8px solid red;\n}',
              options: ['`2px gray`', '`10px`, ikki rang aralashgan', 'Chegara yoʻq', '`8px red`'],
              answer: 3,
              why: 'Keyin yozilgan `border-left` faqat chap tomonni qayta belgilaydi. Qolgan uch tomon `2px solid gray` boʻlib qoladi.'
            }
          ]
        }
      ]
    },

    /* ================= 6-BOʻLIM ================= */
    {
      title: 'Yakuniy topshiriq',
      blurb: 'Hamma bilganlaringizni bitta kartochkada qoʻllang.',
      steps: [
        {
          id: 'challenge',
          title: 'Yakuniy topshiriq: profil kartochkasi',
          learn: '<p>Endi hammasini birlashtirish vaqti. Bu profil kartochkasining chegaralarini yarating. HTML tayyor, barcha oʻzgarishlar CSS da boʻladi.</p>',
          task: '<ol><li><code>.profile</code>: <code>2px</code> yaxlit <code>royalblue</code> chegara va <code>16px</code> yumaloq burchaklar.</li><li><code>.profile</code> ning chegara va padding bilan birga umumiy kengligi <code>280px</code> boʻlsin.</li><li><code>.avatar</code>: aylana, <code>4px</code> yaxlit <code>gold</code> chegarali.</li><li>Har bir <code>.row</code>: faqat pastida <code>1px</code> uzuq chiziqli <code>gray</code> chiziq.</li><li><code>.follow</code>: chegarasiz va uchlari toʻliq yumaloq.</li></ol>',
          html: '<article class="profile">\n  <div class="avatar">NB</div>\n  <h2>Nodira Bekova</h2>\n  <p class="role">8-sinf, Python toʻgaragi</p>\n  <div class="row"><span>Loyihalar</span> <strong>12</strong></div>\n  <div class="row"><span>Nishonlar</span> <strong>5</strong></div>\n  <button class="follow">Obuna</button>\n</article>',
          css: '.profile {\n  width: 280px;\n  padding: 20px;\n  background: white;\n}\n\n.avatar {\n  width: 80px;\n  height: 80px;\n  display: grid;\n  place-items: center;\n  background: #2d56f2;\n  color: white;\n  font-size: 28px;\n  font-weight: bold;\n}\n\n.profile h2 {\n  margin: 12px 0 0;\n}\n\n.role {\n  margin: 0 0 12px;\n  color: #56617a;\n}\n\n.row {\n  display: flex;\n  justify-content: space-between;\n  padding: 10px 0;\n}\n\n.follow {\n  margin-top: 16px;\n  padding: 10px 26px;\n  font-size: 16px;\n  background: #2d56f2;\n  color: white;\n}\n',

          hint: 'Roʻyxatni yuqoridan pastga, bir qoidadan keyin ikkinchisiga oʻtib bajaring. <code>.row</code> uchun <code>border</code> emas, <code>border-bottom</code> ishlating. Karta kengligi uchun <code>box-sizing</code> haqida oʻylang.',
          tests: [
            ['`.profile` da toʻrt tomonda ham `2px solid royalblue` chegara bor', c => { c.allSides('.profile', 'width', '2px'); c.allSides('.profile', 'style', 'solid'); c.allSides('.profile', 'color', 'royalblue'); }],
            ['`.profile` burchaklari `16px` ga yumaloqlangan', c => c.allCorners('.profile', '16px')],
            ['`.profile` ning umumiy kengligi aniq `280px`', c => { const w = Math.round(c.q('.profile').getBoundingClientRect().width); c.assert(w === 280, '`.profile` ning umumiy kengligi `' + w + 'px`. U `280px` boʻlishi kerak. `box-sizing` berilganmi?'); }],
            ['`.avatar` — aylana', c => c.CORNERS.forEach(k => { const r = c.radius('.avatar', k); c.assert(r.unit === '%' ? r.n >= 50 : r.n >= 44, '`.avatar` ning har bir burchagi uchun `border-radius: 50%` kerak.'); })],
            ['`.avatar` da `4px solid gold` chegara bor', c => { c.allSides('.avatar', 'width', '4px'); c.allSides('.avatar', 'style', 'solid'); c.allSides('.avatar', 'color', 'gold'); }],
            ['Har bir `.row` da faqat pastki `1px dashed gray` chegara bor', c => c.qa('.row').forEach(row => {
              c.expectSide(row, 'bottom', 'width', '1px'); c.expectSide(row, 'bottom', 'style', 'dashed'); c.expectSide(row, 'bottom', 'color', 'gray');
              ['top', 'left', 'right'].forEach(s => c.expectSide(row, s, 'width', '0px'));
            })],
            ['`.follow` da chegara yoʻq', c => c.allSides('.follow', 'width', '0px')],
            ['`.follow` ning uchlari toʻliq yumaloq', c => {
              const h = c.q('.follow').getBoundingClientRect().height;
              c.CORNERS.forEach(k => { const r = c.radius('.follow', k); c.assert(r.unit === 'px' && r.n >= h / 2 - 0.5, '`.follow` burchaklarining piksel radiusi balandligining kamida yarmiga teng boʻlishi kerak. `999px` ni sinab koʻring.'); });
            }]
          ]
        }
      ]
    }
  ]
});

/* Mavzu fayli: Tashqi masofa (margin)
   Format Borders mavzusi bilan bir xil: mavzu -> boʻlimlar -> qadamlar (dars yoki test).
   Tekshiruv yordamchilari (c): q, qa, val, px, n1, rect, room, gap, parentWidth, expectMargin, allMargins, expectProp, assert, src ... */
topics.push({
  id: 'margins',
  title: 'Tashqi masofa',
  blurb: 'margin: bir, ikki va toʻrt qiymat, auto bilan markazlash, manfiy qiymat, margin birlashishi va birliklar.',
  finish: 'Mavzu tugadi. Endi elementlar orasidagi masofani ishonch bilan boshqara olasiz.',
  thumb: '<i style="width:20px;height:20px;border:3px solid"></i><i style="width:20px;height:20px;border:3px solid;margin-left:4px"></i><i style="width:20px;height:20px;border:3px solid;margin-left:20px"></i><i style="width:20px;height:20px;border:3px solid;margin-left:40px"></i>',
  sections: [

    /* ================= 1-BOʻLIM ================= */
    {
      title: 'Margin asoslari',
      blurb: 'Margin nima, toʻrt tomon va qisqa yozuv.',
      steps: [
        {
          id: 'margin-all',
          title: 'Tashqi masofa nima?',
          learn: '<p>Har bir quti atrofida koʻrinmas boʻshliq boʻlishi mumkin. Bu <strong>margin</strong> (tashqi masofa). U qutining chegarasidan <em>tashqarida</em> turadi va qutini qoʻshni elementlardan uzoqlashtiradi.</p><p><code>margin</code> ga bitta qiymat bersangiz, u toʻrt tomonga ham qoʻllanadi.</p>',
          example: 'margin: 24px;',
          task: '<p><code>.box</code> ning toʻrt tomoniga ham <code>24px</code> tashqi masofa bering.</p>',
          html: '<div class="box">Men qutiman.</div>',
          css: '.box {\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n  /* Margin ni shu yerga yozing */\n}\n',

          hint: 'Quti bilan uning tashqarisidagi elementlar orasidagi joyni qaysi xossa boshqaradi? To‘rt tomonda masofa bir xil.',
          tests: [
            ['`.box` ning toʻrt tomonida ham `24px` margin bor', c => c.qa('.box').forEach(b => c.allMargins(b, '24px'))],
            ['Ichki masofa (`padding`) hamon `12px`', c => c.assert(c.lengthMatches('.box', 'padding-top', '12px'), 'Margin — tashqi masofa. Ichki masofa (`padding`) ni `12px` qoldiring va `margin` yozing.')]
          ]
        },
        {
          id: 'margin-sides',
          title: 'Bitta tomon',
          learn: '<p>Toʻrt tomonning har biri uchun alohida xossa bor: <code>margin-top</code> (yuqori), <code>margin-right</code> (oʻng), <code>margin-bottom</code> (pastki) va <code>margin-left</code> (chap).</p><p>Faqat kerakli tomonga masofa bering, qolgan tomonlar <code>0</code> boʻlib qoladi.</p>',
          example: 'margin-left: 40px;\nmargin-top: 16px;',
          task: '<p><code>.box</code> ni chapdan <code>40px</code>, yuqoridan <code>16px</code> suring. Oʻng va pastki tomonda margin boʻlmasin.</p>',
          html: '<div class="box">Men siljiyman.</div>',
          css: '.box {\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n}\n',

          hint: 'Qutining faqat ikki tomoni siljishi kerak. Har bir tomon uchun alohida tashqi masofa xossasini toping.',
          tests: [
            ['Chap margin `40px`', c => c.expectMargin('.box', 'left', '40px')],
            ['Yuqori margin `16px`', c => c.expectMargin('.box', 'top', '16px')],
            ['Oʻng va pastki tomonlarda margin yoʻq', c => ['right', 'bottom'].forEach(s => c.expectMargin('.box', s, '0px'))]
          ]
        },
        {
          id: 'margin-two',
          title: 'Ikki qiymat',
          learn: '<p><code>margin</code> ga ikkita qiymat bersangiz, birinchisi <strong>yuqori va pastki</strong> tomonga, ikkinchisi <strong>chap va oʻng</strong> tomonga beriladi.</p>',
          example: 'margin: 8px 24px;   /* yuqori+pastki, chap+oʻng */',
          task: '<p><code>.badge</code> ga yuqoridan va pastdan <code>8px</code>, chapdan va oʻngdan <code>24px</code> margin bering. Bitta <code>margin</code> qatori yozing.</p>',
          html: '<span class="badge">Yangi</span><span class="badge">Mashhur</span>',
          css: '.badge {\n  display: inline-block;\n  padding: 4px 12px;\n  background: #2d56f2;\n  color: white;\n  border-radius: 999px;\n}\n',

          hint: 'Ikki qiymatli qisqa yozuvda birinchi qiymat tik, ikkinchisi yotiq yo‘nalishga ta’sir qiladi.',
          tests: [
            ['Yuqori va pastki margin `8px`', c => c.qa('.badge').forEach(b => { c.expectMargin(b, 'top', '8px'); c.expectMargin(b, 'bottom', '8px'); })],
            ['Chap va oʻng margin `24px`', c => c.qa('.badge').forEach(b => { c.expectMargin(b, 'left', '24px'); c.expectMargin(b, 'right', '24px'); })],
            ['Bitta `margin` qatori yozilgan', c => c.assert(/(^|[;{\s])margin\s*:/.test(c.src) && !/margin-(top|right|bottom|left)\s*:/.test(c.src), 'Alohida `margin-top`, `margin-left` qatorlarisiz, bitta `margin:` qatori yozing.')]
          ]
        },
        {
          id: 'margin-four',
          title: 'Toʻrt va uch qiymat',
          learn: '<p><strong>Toʻrtta</strong> qiymat soat strelkasi boʻylab ketadi: yuqori, oʻng, pastki, chap.</p><p><strong>Uchta</strong> qiymatda birinchisi — yuqori, ikkinchisi — chap va oʻng, uchinchisi — pastki.</p>',
          example: 'margin: 10px 20px 30px 40px; /* yuqori, oʻng, pastki, chap */\nmargin: 5px 15px 25px;       /* yuqori, chap+oʻng, pastki */',
          task: '<ol><li><code>.one</code> ga toʻrt qiymat bering: yuqori <code>10px</code>, oʻng <code>20px</code>, pastki <code>30px</code>, chap <code>40px</code>.</li><li><code>.two</code> ga uch qiymat bering: yuqori <code>5px</code>, chap va oʻng <code>15px</code>, pastki <code>25px</code>.</li></ol>',
          html: '<div class="box one">.one</div>\n<div class="box two">.two</div>',
          css: '.box {\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n}\n\n.one {\n}\n\n.two {\n}\n',

          hint: 'To‘rtta qiymatni yuqoridan boshlab aylana bo‘ylab o‘qing. Uchta qiymat berilganda qaysi tomonlar bitta qiymatni bo‘lishadi?',
          tests: [
            ['`.one` margini: yuqori `10px`, oʻng `20px`, pastki `30px`, chap `40px`', c => { c.expectMargin('.one', 'top', '10px'); c.expectMargin('.one', 'right', '20px'); c.expectMargin('.one', 'bottom', '30px'); c.expectMargin('.one', 'left', '40px'); }],
            ['`.two` margini: yuqori `5px`, chap va oʻng `15px`, pastki `25px`', c => { c.expectMargin('.two', 'top', '5px'); c.expectMargin('.two', 'right', '15px'); c.expectMargin('.two', 'bottom', '25px'); c.expectMargin('.two', 'left', '15px'); }]
          ]
        },
        {
          id: 'quiz-margin-basics',
          title: 'Margin asoslari testi',
          questions: [
            {
              q: '`margin` va `padding` orasidagi asosiy farq nima?',
              options: ['`margin` chegaradan tashqaridagi, `padding` chegara ichidagi boʻshliq', '`margin` chegara ichidagi, `padding` tashqaridagi boʻshliq', 'Ularning farqi yoʻq', '`margin` faqat matnga, `padding` faqat rasmga taʼsir qiladi'],
              answer: 0,
              why: '`margin` qutining chegarasidan tashqarisida, `padding` esa chegara bilan mazmun orasida joylashadi.'
            },
            {
              q: '`margin: 10px 20px;` da `10px` qaysi tomonlarga beriladi?',
              options: ['Chap va oʻng', 'Yuqori va pastki', 'Faqat yuqori', 'Faqat pastki'],
              answer: 1,
              why: 'Ikki qiymatda birinchisi yuqori va pastki, ikkinchisi chap va oʻng tomonlarga beriladi.'
            },
            {
              q: 'Bu qutining chap margini qancha?',
              code: '.box {\n  margin: 5px 10px 15px 20px;\n}',
              options: ['`5px`', '`10px`', '`15px`', '`20px`'],
              answer: 3,
              why: 'Toʻrt qiymat soat strelkasi boʻylab ketadi: yuqori `5px`, oʻng `10px`, pastki `15px`, chap `20px`.'
            },
            {
              q: 'Bu qutining pastki va chap margini qancha?',
              code: '.box {\n  margin: 8px 16px 24px;\n}',
              options: ['Pastki `24px`, chap `16px`', 'Pastki `24px`, chap `8px`', 'Pastki `16px`, chap `24px`', 'Pastki `8px`, chap `16px`'],
              answer: 0,
              why: 'Uch qiymatda: yuqori `8px`, chap va oʻng `16px`, pastki `24px`.'
            },
            {
              q: 'Faqat yuqori tomonga `30px` masofa berish uchun qaysi kod toʻgʻri?',
              options: ['`margin: 30px;`', '`margin-up: 30px;`', '`margin-top: 30px;`', '`top-margin: 30px;`'],
              answer: 2,
              why: 'Yuqori tomon uchun xossa — `margin-top`. `margin: 30px;` esa toʻrt tomonga ham masofa beradi.'
            }
          ]
        }
      ]
    },

    /* ================= 2-BOʻLIM ================= */
    {
      title: 'Auto va manfiy margin',
      blurb: 'auto bilan markazlash va surish, manfiy qiymat.',
      steps: [
        {
          id: 'margin-auto',
          title: 'Gorizontal markazlash',
          learn: '<p>Kengligi berilgan blok elementni oʻz konteyneri ichida gorizontal markazlash uchun chap va oʻng margin larga <code>auto</code> bering: brauzer qolgan boʻsh joyni ikki tomonga teng boʻlib beradi.</p><p><code>margin: 0 auto;</code> — yuqori va pastki <code>0</code>, chap va oʻng <code>auto</code>.</p>',
          example: 'margin: 0 auto;',
          task: '<p><code>.box</code> ning kengligi <code>240px</code>. Uni konteyner ichida gorizontal markazga qoʻying.</p>',
          html: '<div class="box">Men markazdaman.</div>',
          css: '.box {\n  width: 240px;\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n}\n',

          hint: 'Blok kengligi berilgan. Qolgan joy chap va o‘ng tomonga teng taqsimlanishi uchun yon masofalar qanday hisoblanishi kerak?',
          tests: [
            ['Quti gorizontal markazda', c => { const r = c.room('.box'); c.assert(r.left > 1 && Math.abs(r.left - r.right) < 1, 'Quti markazda emas: chapda `' + c.n1(r.left) + 'px`, oʻngda `' + c.n1(r.right) + 'px` boʻsh joy bor. Ikkalasi teng boʻlishi kerak.'); }],
            ['Chap va oʻng margin larda `auto` ishlatilgan', c => c.assert(/auto/.test(c.src), 'Chap va oʻng margin larga `auto` bering: `margin: 0 auto;`.')],
            ['Quti kengligi hamon `240px`', c => c.assert(c.lengthMatches('.box', 'width', '240px'), 'Kenglikni `240px` qoldiring.')]
          ]
        },
        {
          id: 'margin-push',
          title: 'Oʻngga surish',
          learn: '<p><code>auto</code> margin boʻsh joyni oʻziga oladi. Agar faqat <code>margin-left: auto</code> bersangiz, barcha boʻsh joy chap tomonga ketadi va element <strong>oʻng chetga</strong> suriladi.</p><p>Xuddi shunday <code>margin-right: auto</code> elementni chap chetda ushlab turadi.</p>',
          example: 'margin-left: auto;',
          task: '<p><code>.logout</code> ning kengligi <code>120px</code>. Uni konteynerning oʻng chetiga suring. Faqat chap margin ga <code>auto</code> bering.</p>',
          html: '<div class="logout">Chiqish</div>',
          css: '.logout {\n  width: 120px;\n  padding: 10px;\n  text-align: center;\n  background: #fde5e7;\n  border: 2px solid #c1303c;\n}\n',

          hint: 'Blok o‘ngga surilishi uchun bo‘sh joy uning qaysi tomonida yig‘ilishi kerak?',
          tests: [
            ['Quti oʻng chetga taqalgan', c => { const r = c.room('.logout'); c.assert(r.left > 1 && Math.abs(r.right) < 1, 'Quti oʻng chetga taqalmagan: chapda `' + c.n1(r.left) + 'px`, oʻngda `' + c.n1(r.right) + 'px` boʻsh joy bor. Oʻngda `0px` boʻlishi kerak.'); }],
            ['Chap margin da `auto` ishlatilgan', c => c.assert(/auto/.test(c.src), '`margin-left: auto;` deb yozing.')],
            ['Quti kengligi hamon `120px`', c => c.assert(c.lengthMatches('.logout', 'width', '120px'), 'Kenglikni `120px` qoldiring.')]
          ]
        },
        {
          id: 'margin-negative',
          title: 'Manfiy margin',
          learn: '<p>Margin <strong>manfiy</strong> ham boʻlishi mumkin. Manfiy qiymat elementni oʻz joyidan tegishli tomonga tortadi. Masalan, ota-onaning ichki masofasi (padding) ichida turgan elementni uning chetlarigacha yoyish mumkin.</p>',
          example: 'margin-left: -20px;\nmargin: 0 -20px;',
          task: '<p><code>.card</code> ning ichki masofasi <code>20px</code>. <code>.banner</code> ni karta chetlarigacha yoyish uchun uning chap va oʻng margin larini <code>-20px</code> qiling. Yuqori va pastki margin <code>0</code> qolsin.</p>',
          html: '<div class="card">\n  <div class="banner">Maxsus taklif</div>\n  <p>Banner kartaning ikki chetigacha choʻzilgan.</p>\n</div>',
          css: '.card {\n  padding: 20px;\n  background: white;\n  border: 2px solid #2d56f2;\n}\n\n.banner {\n  padding: 10px 20px;\n  background: #2d56f2;\n  color: white;\n  font-weight: bold;\n}\n',

          hint: 'Ota elementning ichki masofasi bannerni chetdan uzoqlashtirgan. Yon margin qiymatining ishorasi o‘zgarsa nima bo‘ladi?',
          tests: [
            ['`.banner` ning chap va oʻng margini `-20px`', c => { c.expectMargin('.banner', 'left', '-20px'); c.expectMargin('.banner', 'right', '-20px'); }],
            ['Banner kartaning ikki chetigacha yetadi', c => {
              const b = c.rect('.banner'), k = c.rect('.card'), bw = c.px(c.val('.card', 'border-left-width'));
              const l = b.left - k.left - bw, r = k.right - b.right - bw;
              c.assert(Math.abs(l) < 0.6 && Math.abs(r) < 0.6, 'Banner kartaning ichki chetlariga yetib bormayapti: chapda `' + c.n1(l) + 'px`, oʻngda `' + c.n1(r) + 'px` masofa bor.');
            }],
            ['Yuqori va pastki margin `0`', c => { c.expectMargin('.banner', 'top', '0px'); c.expectMargin('.banner', 'bottom', '0px'); }]
          ]
        },
        {
          id: 'quiz-margin-auto',
          title: 'Auto va manfiy margin testi',
          questions: [
            {
              q: 'Kengligi `300px` boʻlgan blokni gorizontal markazlash uchun qaysi kod kerak?',
              options: ['`margin: auto 0;`', '`margin: 0 auto;`', '`text-align: auto;`', '`margin: center;`'],
              answer: 1,
              why: 'Chap va oʻng margin lar `auto` boʻlsa, boʻsh joy ikki tomonga teng boʻlinadi.'
            },
            {
              q: 'Bu kod elementni qayerga joylashtiradi?',
              code: '.box {\n  width: 100px;\n  margin-left: auto;\n}',
              options: ['Chap chetga', 'Markazga', 'Oʻng chetga', 'Pastga'],
              answer: 2,
              why: '`margin-left: auto` chap tomondagi barcha boʻsh joyni oladi, shuning uchun element oʻngga suriladi.'
            },
            {
              q: 'Nima uchun `margin: 0 auto;` kengligi berilmagan oddiy `div` ni markazga keltirmaydi?',
              options: ['Kenglik berilmasa, blok konteynerning butun kengligini egallaydi va boʻsh joy qolmaydi', '`auto` faqat matnga ishlaydi', '`0` qiymati markazlashni bekor qiladi', '`div` da margin ishlamaydi'],
              answer: 0,
              why: 'Oddiy blok butun kenglikni egallaydi. Taqsimlash uchun boʻsh joy yoʻq, shuning uchun kenglik (`width`) berilishi kerak.'
            },
            {
              q: '`margin-left: -10px;` nima qiladi?',
              options: ['Xato: margin manfiy boʻlmaydi', 'Elementni 10px chapga tortadi', 'Elementni 10px oʻngga suradi', 'Elementning chap tomonini 10px kichraytiradi'],
              answer: 1,
              why: 'Manfiy margin elementni tegishli tomonga tortadi. Kengligi `auto` boʻlgan blok esa chapga 10px kengayadi.'
            }
          ]
        }
      ]
    },

    /* ================= 3-BOʻLIM ================= */
    {
      title: 'Margin birlashishi',
      blurb: 'Vertikal margin lar nega birlashadi va qachon qoʻshiladi.',
      steps: [
        {
          id: 'collapse-siblings',
          title: 'Vertikal margin birlashishi',
          learn: '<p>Ikki blok element ustma-ust turganda, ularning <strong>vertikal</strong> margin lari qoʻshilmaydi, <strong>birlashadi</strong>. Oraliq masofa ikkalasidan <em>kattasiga</em> teng boʻladi.</p><p>Masalan, yuqoridagi quti <code>margin-bottom: 30px</code>, pastdagisi <code>margin-top: 20px</code> bersa, oraliq <code>50px</code> emas, <code>30px</code> boʻladi.</p>',
          example: '.a { margin-bottom: 30px; }\n.b { margin-top: 20px; }\n/* oraliq = 30px, chunki 30 > 20 */',
          task: '<p>Hozir <code>.a</code> va <code>.b</code> orasidagi masofa <code>30px</code>. Faqat <code>.b</code> ning <code>margin-top</code> qiymatini oʻzgartirib, oraliqni <code>50px</code> qiling.</p>',
          html: '<div class="box a">.a</div>\n<div class="box b">.b</div>',
          css: '.box {\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n}\n\n.a {\n  margin-bottom: 30px;\n}\n\n.b {\n  margin-top: 20px;\n}\n',

          hint: 'Tik yo‘nalishda ikki musbat margin tutashganda kattarog‘i qoladi. Maqsaddagi oraliqni ikkala qiymat bilan solishtiring.',
          tests: [
            ['`.a` va `.b` orasidagi masofa `50px`', c => { const g = c.gap('.a', '.b'); c.assert(Math.abs(g - 50) < 0.6, '`.a` va `.b` orasidagi masofa `' + c.n1(g) + 'px`, lekin `50px` boʻlishi kerak. Vertikal margin lar qoʻshilmaydi: ikkalasidan kattasi olinadi.'); }],
            ['`.b` ning `margin-top` i `50px`', c => c.expectMargin('.b', 'top', '50px')],
            ['`.a` ning `margin-bottom` i oʻzgarmagan (`30px`)', c => c.expectMargin('.a', 'bottom', '30px')]
          ]
        },
        {
          id: 'collapse-parent',
          title: 'Ota-ona va bola margini',
          learn: '<p>Birlashish ota-ona va uning birinchi (yoki oxirgi) bolasi orasida ham boʻladi, agar ota-onada <strong>chegara</strong> yoki <strong>padding</strong> boʻlmasa. Bolaning yuqori margini ota-onadan tashqariga chiqib, <em>butun</em> ota-onani suradi.</p><p>Tuzatish: ota-onaga <code>display: flow-root</code> bering. Bu uni ichidagi margin larni ushlab turadigan alohida blokka aylantiradi. <code>padding</code> yoki <code>border</code> ham yordam beradi.</p>',
          example: 'display: flow-root;',
          task: '<p><code>.inner</code> ning <code>margin-top: 30px</code> margini ichkarida qolishi kerak edi, lekin u butun <code>.outer</code> ni pastga suryapti. <code>.outer</code> ga bitta qator qoʻshib buni tuzating. <code>.inner</code> ning margin ini oʻzgartirmang.</p>',
          html: '<div class="outer">\n  <div class="inner">Ichki quti</div>\n</div>',
          css: '.outer {\n  background: #fff3c4;\n}\n\n.inner {\n  margin-top: 30px;\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n}\n',

          hint: 'Ichki blokning margini ota qutidan tashqariga chiqmoqda. Ota qutida yangi blok formatlash kontekstini hosil qilish yo‘lini izlang.',
          tests: [
            ['`.inner` `.outer` ichida, uning yuqori chetidan `30px` pastda', c => { const d = c.rect('.inner').top - c.rect('.outer').top; c.assert(d >= 29.5 && d <= 32, '`.inner` `.outer` ning yuqori chetidan `' + c.n1(d) + 'px` pastda. Margin ota-onadan tashqariga chiqib ketyapti. `.outer` ga `display: flow-root;` qoʻshing.'); }],
            ['`.inner` ning `margin-top` i hamon `30px`', c => c.expectMargin('.inner', 'top', '30px')]
          ]
        },
        {
          id: 'margins-add',
          title: 'Yon tomonlarda margin lar qoʻshiladi',
          learn: '<p>Birlashish faqat <strong>vertikal</strong> margin larga xos va faqat oddiy blok joylashuvida sodir boʻladi. <strong>Gorizontal</strong> margin lar hech qachon birlashmaydi, ular qoʻshiladi.</p><p>Flex konteyner ichidagi elementlarning margin lari ham birlashmaydi.</p>',
          example: '.a { margin-right: 10px; }\n.b { margin-left: 30px; }\n/* oraliq = 10 + 30 = 40px */',
          task: '<p>Qutilar yonma-yon turibdi. <code>.a</code> ning oʻng margini <code>10px</code>. Faqat <code>.b</code> ga <code>margin-left</code> berib, qutilar orasidagi masofani <code>40px</code> qiling.</p>',
          html: '<div class="row">\n  <div class="box a">.a</div>\n  <div class="box b">.b</div>\n</div>',
          css: '.row {\n  display: flex;\n}\n\n.box {\n  padding: 12px;\n  background: #e6ecff;\n  border: 2px solid #2d56f2;\n}\n\n.a {\n  margin-right: 10px;\n}\n\n.b {\n}\n',

          hint: 'Flex qatorida qo‘shni marginlar yig‘iladi. Birinchi qutining hissasini kerakli umumiy oraliqdan ayiring.',
          tests: [
            ['`.a` va `.b` orasidagi masofa `40px`', c => { const g = c.hgap('.a', '.b'); c.assert(Math.abs(g - 40) < 0.6, '`.a` va `.b` orasidagi masofa `' + c.n1(g) + 'px`, lekin `40px` boʻlishi kerak. Gorizontal margin lar qoʻshiladi: `.a` ning oʻng margini (`10px`) ham hisobga oling.'); }],
            ['`.b` ning `margin-left` i `30px`', c => c.expectMargin('.b', 'left', '30px')],
            ['`.a` ning `margin-right` i oʻzgarmagan (`10px`)', c => c.expectMargin('.a', 'right', '10px')]
          ]
        },
        {
          id: 'quiz-collapse',
          title: 'Margin birlashishi testi',
          questions: [
            {
              q: 'Ustma-ust turgan `.a` va `.b` bloklari orasidagi masofa qancha?',
              code: '.a { margin-bottom: 40px; }\n.b { margin-top: 25px; }',
              options: ['`65px`', '`40px`', '`25px`', '`15px`'],
              answer: 1,
              why: 'Vertikal margin lar birlashadi va kattasi olinadi: `40px`. Ular qoʻshilmaydi.'
            },
            {
              q: 'Qaysi holatda margin lar birlashmaydi, balki qoʻshiladi?',
              options: ['Ikki blokning vertikal margin lari', 'Ota-ona va birinchi bolaning yuqori margin lari', 'Yonma-yon turgan qutilarning gorizontal margin lari', 'Hech qachon qoʻshilmaydi'],
              answer: 2,
              why: 'Gorizontal margin lar hech qachon birlashmaydi, ular qoʻshiladi.'
            },
            {
              q: 'Ota-onada chegara ham, padding ham yoʻq. Birinchi bolaning `margin-top: 20px` i nima qiladi?',
              options: ['Bolani ota-ona ichida 20px pastga suradi', 'Hech narsa qilmaydi', 'Xato beradi', 'Ota-ona bilan birlashib, butun ota-onani 20px pastga suradi'],
              answer: 3,
              why: 'Bolaning margini ota-onaning margini bilan birlashadi va ota-onadan tashqariga chiqib ketadi.'
            },
            {
              q: 'Ota-ona va bola margin lari birlashishini qaysi usul oldini oladi?',
              options: ['Ota-onaga `display: flow-root;` berish', 'Bolaga `margin: auto;` berish', 'Ota-onadan `width` ni olib tashlash', 'Bolaga `display: none;` berish'],
              answer: 0,
              why: '`flow-root` (shuningdek `padding` yoki `border`) ota-onani ichidagi margin lar birlashmaydigan alohida blokka aylantiradi.'
            },
            {
              q: 'Flex konteyner ichida yonma-yon turgan ikki qutida `margin-right: 15px` va `margin-left: 15px` bor. Ular orasidagi masofa qancha?',
              options: ['`15px`', '`0px`', '`45px`', '`30px`'],
              answer: 3,
              why: 'Gorizontal margin lar birlashmaydi, qoʻshiladi: 15 + 15 = `30px`.'
            }
          ]
        }
      ]
    },

    /* ================= 4-BOʻLIM ================= */
    {
      title: 'Birliklar va element turlari',
      blurb: 'Inline elementlar, em va foiz, brauzer margin lari, oxirgi element.',
      steps: [
        {
          id: 'inline-margin',
          title: 'Inline elementlarda margin',
          learn: '<p><code>span</code>, <code>a</code>, <code>strong</code> kabi <strong>inline</strong> elementlarda faqat <em>gorizontal</em> margin (<code>margin-left</code>, <code>margin-right</code>) ishlaydi. Vertikal margin lar eʼtiborga olinmaydi.</p><p>Vertikal margin ishlashi uchun elementga <code>display: inline-block</code> (yoki <code>block</code>) bering.</p>',
          example: 'display: inline-block;\nmargin-top: 12px;',
          task: '<p><code>.tag</code> — <code>span</code> elementi. Unga <code>margin-top: 12px</code> berilgan, lekin u ishlamayapti. <code>.tag</code> ga bitta qator qoʻshib, buni tuzating.</p>',
          html: '<p>Mavzu: <span class="tag">CSS</span> darslari</p>',
          css: '.tag {\n  padding: 2px 10px;\n  background: #2d56f2;\n  color: white;\n  margin-top: 12px;\n}\n',

          hint: 'Satr ichidagi element tik marginni qanday qo‘llaydi? Uni o‘z satrida saqlab, blokdek o‘lchash imkonini beradigan ko‘rsatish turini izlang.',
          tests: [
            ['`.tag` endi `inline` emas', c => c.assert(c.val('.tag', 'display') !== 'inline', '`.tag` hamon `inline`. Vertikal margin ishlashi uchun `display: inline-block;` bering.')],
            ['`.tag` ning `margin-top` i `12px`', c => c.expectMargin('.tag', 'top', '12px')],
            ['Vertikal margin ishlayapti (qator balandroq boʻldi)', c => c.assert(c.rect('p').height > 30, 'Vertikal margin hali taʼsir qilmayapti. `inline` elementlarda u ishlamaydi.')]
          ]
        },
        {
          id: 'margin-units',
          title: 'Birliklar: em va foiz',
          learn: '<p>Margin faqat piksel bilan emas, boshqa birliklar bilan ham yoziladi.</p><ul><li><code>em</code> — elementning oʻz shrift oʻlchamiga nisbatan. <code>font-size: 20px</code> da <code>1.5em</code> = <code>30px</code>.</li><li><code>%</code> — ota-onaning <strong>kengligiga</strong> nisbatan (yuqori va pastki margin uchun ham aynan kenglikdan hisoblanadi).</li></ul>',
          example: 'margin-bottom: 1.5em;\nmargin-left: 10%;',
          task: '<p><code>.note</code> ning shrift oʻlchami <code>20px</code>. Unga pastdan <code>1.5em</code> va chapdan <code>10%</code> margin bering.</p>',
          html: '<div class="note">Eslatma: margin turli birliklarda yoziladi.</div>',
          css: '.note {\n  font-size: 20px;\n  padding: 12px;\n  background: #fff3c4;\n  border: 2px solid #d9a400;\n}\n',

          hint: 'Tik masofani shrift o‘lchamiga, yon masofani esa ota qutining kengligiga bog‘laydigan birliklarni tanlang.',
          tests: [
            ['Pastki margin `1.5em` (`30px`) ga teng', c => c.expectMargin('.note', 'bottom', '30px', '1.5em (30px)')],
            ['Pastki margin `em` birligida yozilgan', c => c.assert(/margin(-bottom)?\s*:[^;}]*\d\.?\d*em/.test(c.src), '`px` oʻrniga `1.5em` deb yozing.')],
            ['Chap margin ota-ona kengligining `10%` iga teng', c => { const want = c.parentWidth('.note') * 0.1, got = c.px(c.val('.note', 'margin-left')); c.assert(Math.abs(got - want) < 0.6, 'Chap margin `' + c.n1(got) + 'px`, lekin ota-ona kengligining `10%` i (`' + c.n1(want) + 'px`) boʻlishi kerak.'); }],
            ['Chap margin `%` birligida yozilgan', c => c.assert(/margin(-left)?\s*:[^;}]*%/.test(c.src), '`margin-left: 10%;` deb yozing.')]
          ]
        },
        {
          id: 'default-margins',
          title: 'Brauzer bergan margin lar',
          learn: '<p>Brauzer baʼzi elementlarga oʻzi margin beradi: <code>h1</code>–<code>h6</code>, <code>p</code>, <code>ul</code>, <code>ol</code> va hatto <code>body</code> (<code>8px</code>). Shu sababli sarlavha va matn orasida kutilmagan boʻshliq paydo boʻladi.</p><p>Odatda dasturchilar bu margin larni <code>0</code> qilib, kerakli masofani oʻzlari beradi.</p>',
          example: 'margin: 0;\nmargin: 4px 0 0;',
          task: '<p>Sarlavha (<code>.title</code>) va matn (<code>.text</code>) orasida brauzer bergan katta masofa bor. <code>.title</code> ning margin ini <code>0</code> qiling, <code>.text</code> ga esa faqat yuqoridan <code>4px</code> margin bering (qolgan tomonlar <code>0</code>). Natijada ular orasidagi masofa <code>4px</code> boʻlsin.</p>',
          html: '<h2 class="title">Kosmos haqida</h2>\n<p class="text">Venerada kun uning yilidan uzunroq.</p>',
          css: '.title {\n  background: #e6ecff;\n}\n\n.text {\n  background: #fff3c4;\n}\n',

          hint: 'Brauzer sarlavha va paragrafga o‘z marginlarini beradi. Avval qaysi chetlar nol bo‘lishini, keyin kerakli oraliq qayerda qolishini aniqlang.',
          tests: [
            ['`.title` ning margini `0`', c => ['top', 'right', 'bottom', 'left'].forEach(s => c.expectMargin('.title', s, '0px'))],
            ['`.text` ning yuqori margini `4px`, qolgan tomonlari `0`', c => { c.expectMargin('.text', 'top', '4px'); ['right', 'bottom', 'left'].forEach(s => c.expectMargin('.text', s, '0px')); }],
            ['Sarlavha va matn orasidagi masofa `4px`', c => { const g = c.gap('.title', '.text'); c.assert(Math.abs(g - 4) < 0.6, 'Sarlavha va matn orasidagi masofa `' + c.n1(g) + 'px`, lekin `4px` boʻlishi kerak.'); }]
          ]
        },
        {
          id: 'last-child',
          title: 'Oxirgi elementdan margin ni olib tashlash',
          learn: '<p>Roʻyxatdagi har bir elementga <code>margin-bottom</code> bersangiz, oxirgisining pastida ham ortiqcha masofa qoladi. <code>:last-child</code> ota-onadagi <em>oxirgi</em> bolani tanlaydi. Uning margin ini <code>0</code> qilib, ortiqcha boʻshliqni yoʻqotish mumkin.</p>',
          example: '.item {\n  margin-bottom: 12px;\n}\n\n.item:last-child {\n  margin-bottom: 0;\n}',
          task: '<p><code>.menu li</code> elementlariga <code>12px</code> pastki margin berilgan. Oxirgi <code>li</code> ning pastki margin ini <code>0</code> qiling. <code>:last-child</code> dan foydalaning.</p>',
          html: '<ul class="menu">\n  <li>Bosh sahifa</li>\n  <li>Darslar</li>\n  <li>Testlar</li>\n</ul>',
          css: '.menu {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.menu li {\n  margin-bottom: 12px;\n  padding: 8px 12px;\n  background: #e6ecff;\n}\n',

          hint: 'Faqat ro‘yxatning oxirgi bandini tanlaydigan psevdosinfni toping. Umumiy qoida bilan maxsus qoida tartibini tekshiring.',
          tests: [
            ['Birinchi ikkita `li` ning pastki margini `12px`', c => { const li = c.qa('.menu li'); c.expectMargin(li[0], 'bottom', '12px'); c.expectMargin(li[1], 'bottom', '12px'); }],
            ['Oxirgi `li` ning pastki margini `0`', c => { const li = c.qa('.menu li'); c.expectMargin(li[li.length - 1], 'bottom', '0px'); }],
            ['`:last-child` ishlatilgan', c => c.assert(/:last-child/.test(c.src), 'Oxirgi elementni tanlash uchun `:last-child` dan foydalaning.')]
          ]
        },
        {
          id: 'quiz-margin-units',
          title: 'Birliklar va element turlari testi',
          questions: [
            {
              q: '`span` ga `margin-top: 20px` berildi, lekin hech narsa oʻzgarmadi. Sabab nima?',
              options: ['`span` — inline element, unda vertikal margin lar eʼtiborga olinmaydi', '`20px` juda kichik qiymat', '`margin-top` faqat `div` da ishlaydi', 'Bu brauzer xatosi'],
              answer: 0,
              why: 'Inline elementlarda faqat gorizontal margin lar ishlaydi. Vertikal margin uchun `display: inline-block` yoki `block` kerak.'
            },
            {
              q: 'Bu qutining yuqori margini necha piksel?',
              code: '.box {\n  font-size: 20px;\n  margin-top: 2em;\n}',
              options: ['`2px`', '`20px`', '`40px`', '`32px`'],
              answer: 2,
              why: '`em` elementning oʻz shrift oʻlchamiga nisbatan hisoblanadi: 2 × 20px = `40px`.'
            },
            {
              q: 'Ota-onaning kengligi `600px`. `margin-left: 10%` necha piksel boʻladi?',
              options: ['`10px`', '`60px`', '`6px`', '`600px`'],
              answer: 1,
              why: 'Foiz ota-onaning kengligidan hisoblanadi: 600px ning 10% i — `60px`.'
            },
            {
              q: 'Nima uchun sarlavha va paragraf orasida, siz hech narsa yozmagan boʻlsangiz ham, boʻshliq bor?',
              options: ['Bu CSS xatosi', 'Sarlavha matnida ortiqcha boʻsh joylar bor', 'Elementlar orasida har doim `10px` masofa boʻladi', 'Brauzer sarlavha va paragraflarga oʻzi standart margin beradi'],
              answer: 3,
              why: 'Brauzerning standart uslublari `h1`–`h6`, `p`, `ul` va boshqa elementlarga margin beradi. Ularni `margin: 0` bilan tozalash mumkin.'
            },
            {
              q: '`.item:last-child { margin-bottom: 0; }` nimani anglatadi?',
              options: ['Barcha `.item` larning pastki margini `0` qiladi', 'Ota-onadagi oxirgi bola boʻlgan `.item` ning pastki margini `0` qiladi', 'Birinchi `.item` ning margini `0` qiladi', '`.item` ichidagi oxirgi elementning margini `0` qiladi'],
              answer: 1,
              why: '`:last-child` ota-onadagi oxirgi bolani tanlaydi. Shunda roʻyxat oxirida ortiqcha masofa qolmaydi.'
            }
          ]
        }
      ]
    },

    /* ================= 5-BOʻLIM ================= */
    {
      title: 'Yakuniy topshiriq',
      blurb: 'Hamma bilganlaringizni bitta kartochkada qoʻllang.',
      steps: [
        {
          id: 'margin-challenge',
          title: 'Yakuniy topshiriq: maqola kartochkasi',
          learn: '<p>Endi hammasini birlashtirish vaqti. Bu maqola kartochkasining tashqi masofalarini toʻgʻrilang. HTML tayyor, barcha oʻzgarishlar CSS da boʻladi.</p>',
          task: '<ol><li><code>.post</code>: yuqoridan va pastdan <code>24px</code> margin, gorizontal markazda.</li><li><code>.banner</code>: kartaning ikki chetigacha yetsin (kartaning ichki masofasi <code>20px</code>), pastida <code>16px</code> margin. Yuqorida margin yoʻq.</li><li><code>h2</code>: yuqorida <code>0</code>, pastda <code>8px</code> margin. Yon margin lar <code>0</code>.</li><li>Har bir <code>p</code>: yuqorida <code>0</code>, pastda <code>12px</code> margin.</li><li><code>.tag</code>: oʻng tomonida <code>8px</code> masofa.</li><li><code>.more</code> tugmasi kartaning oʻng chetiga taqalsin. Buning uchun uni <code>display: block</code> qiling va <code>margin-left: auto</code> bering.</li></ol>',
          html: '<article class="post">\n  <div class="banner">Yangi maqola</div>\n  <h2>Kosmosga sayohat</h2>\n  <p class="meta"><span class="tag">Fan</span>5 daqiqa oʻqish</p>\n  <p>Venerada kun uning yilidan uzunroq.</p>\n  <p>Marsning ikkita kichik yoʻldoshi bor.</p>\n  <button class="more">Batafsil</button>\n</article>',
          css: '.post {\n  width: 300px;\n  padding: 20px;\n  background: white;\n  border: 2px solid #2d56f2;\n}\n\n.banner {\n  padding: 10px 20px;\n  background: #2d56f2;\n  color: white;\n  font-weight: bold;\n}\n\n.tag {\n  padding: 2px 10px;\n  background: #e6ecff;\n  border-radius: 999px;\n}\n\n.more {\n  padding: 8px 20px;\n  font-size: 15px;\n}\n',

          hint: 'Roʻyxatni yuqoridan pastga, bir qoidadan keyin ikkinchisiga oʻtib bajaring. Markazlash uchun <code>auto</code>, banner uchun manfiy qiymat, <code>.more</code> uchun esa <code>display: block</code> kerak.',
          tests: [
            ['`.post` ning yuqori va pastki margini `24px`', c => { c.expectMargin('.post', 'top', '24px'); c.expectMargin('.post', 'bottom', '24px'); }],
            ['`.post` gorizontal markazda', c => { const r = c.room('.post'); c.assert(r.left > 1 && Math.abs(r.left - r.right) < 1, '`.post` markazda emas: chapda `' + c.n1(r.left) + 'px`, oʻngda `' + c.n1(r.right) + 'px` boʻsh joy bor.'); }],
            ['`.banner` kartaning ikki chetigacha yetadi', c => {
              const b = c.rect('.banner'), k = c.rect('.post'), bw = c.px(c.val('.post', 'border-left-width'));
              const l = b.left - k.left - bw, r = k.right - b.right - bw;
              c.assert(Math.abs(l) < 0.6 && Math.abs(r) < 0.6, '`.banner` kartaning ichki chetlariga yetib bormayapti: chapda `' + c.n1(l) + 'px`, oʻngda `' + c.n1(r) + 'px` masofa bor. Padding `20px` edi.');
            }],
            ['`.banner` ning pastki margini `16px`, yuqorisi `0`', c => { c.expectMargin('.banner', 'bottom', '16px'); c.expectMargin('.banner', 'top', '0px'); }],
            ['`h2` ning margini: yuqori `0`, pastki `8px`, yon tomonlar `0`', c => { c.expectMargin('h2', 'top', '0px'); c.expectMargin('h2', 'bottom', '8px'); c.expectMargin('h2', 'left', '0px'); c.expectMargin('h2', 'right', '0px'); }],
            ['Har bir `p` ning margini: yuqori `0`, pastki `12px`', c => c.qa('.post p').forEach(p => { c.expectMargin(p, 'top', '0px'); c.expectMargin(p, 'bottom', '12px'); })],
            ['`.tag` ning oʻng margini `8px`', c => c.expectMargin('.tag', 'right', '8px')],
            ['`.more` kartaning oʻng chetiga taqalgan', c => { const r = c.room('.more'); c.assert(r.left > 1 && Math.abs(r.right) < 1, '`.more` oʻng chetga taqalmagan: chapda `' + c.n1(r.left) + 'px`, oʻngda `' + c.n1(r.right) + 'px` boʻsh joy bor. `display: block;` va `margin-left: auto;` kerak.'); }]
          ]
        }
      ]
    }
  ]
});


if (typeof module !== 'undefined') module.exports = topics;
else window.TOPICS = topics;
