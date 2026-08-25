document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- CAROUSEL ---------------- */

  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');

  if (!track || !dotsWrap) return;

  const cards = Array.from(track.children);

  if (!cards.length) return;

  /*
   * Permite scroll vertical da página.
   * O JS só controla o gesto quando ele é horizontal.
   */
  track.style.scrollSnapType = 'none';
  track.style.touchAction = 'pan-y';


  /* ---------------- DOTS ---------------- */

  cards.forEach((_, i) => {

    const dot = document.createElement('span');

    if (i === 0) {
      dot.classList.add('active');
    }

    dot.addEventListener('click', () => {
      goToCard(i);
    });

    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);


  /* ---------------- UPDATE DOTS ---------------- */

  function updateDots(index = getClosestIndex()) {

    dots.forEach((dot, i) => {

      dot.classList.toggle(
        'active',
        i === index
      );

    });

  }


  /* ---------------- POSITION ---------------- */

  function getClosestIndex() {

    const center =
      track.scrollLeft +
      track.clientWidth / 2;

    let closest = 0;
    let distance = Infinity;

    cards.forEach((card, i) => {

      const cardCenter =
        card.offsetLeft +
        card.offsetWidth / 2;

      const dist =
        Math.abs(cardCenter - center);

      if (dist < distance) {

        distance = dist;
        closest = i;

      }

    });

    return closest;
  }


  /* ---------------- GO TO CARD ---------------- */

  function goToCard(index) {

    /*
     * Limita o índice
     */
    if (index < 0) {
      index = 0;
    }

    if (index >= cards.length) {
      index = cards.length - 1;
    }

    const card = cards[index];

    if (!card) return;


    /*
     * Calcula a posição da imagem
     */
    const target =
      card.offsetLeft -
      (track.clientWidth - card.offsetWidth) / 2;


    const start =
      track.scrollLeft;

    const distance =
      target - start;


    /*
     * Velocidade da animação.
     *
     * 95ms = extremamente rápida
     *
     * Se quiseres 400ms:
     * const duration = 400;
     */
    const duration = 95;

    const startTime =
      performance.now();


    /*
     * Atualiza o indicador imediatamente.
     */
    updateDots(index);


    /*
     * Animação
     */
    function animate(currentTime) {

      const elapsed =
        currentTime - startTime;


      let progress =
        elapsed / duration;


      if (progress > 1) {
        progress = 1;
      }


      /*
       * Easing suave
       */
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 -
            Math.pow(
              -2 * progress + 2,
              2
            ) / 2;


      /*
       * Move o carousel
       */
      track.scrollLeft =
        start +
        distance * ease;


      /*
       * Continua animação
       */
      if (progress < 1) {

        requestAnimationFrame(animate);

      } else {

        /*
         * Garante posição final perfeita
         */
        track.scrollLeft = target;

      }

    }


    requestAnimationFrame(animate);

  }


  /* ---------------- SWIPE ---------------- */

  let isDown = false;

  let startX = 0;
  let startY = 0;

  let currentIndex = 0;


  /*
   * Distância necessária
   * para considerar um swipe.
   */
  const SWIPE_DISTANCE = 40;


  /* ---------------- POINTER DOWN ---------------- */

  track.addEventListener(
    'pointerdown',
    (e) => {

      /*
       * Apenas botão esquerdo
       * quando for mouse.
       */
      if (
        e.pointerType === 'mouse' &&
        e.button !== 0
      ) {
        return;
      }


      isDown = true;


      startX =
        e.clientX;

      startY =
        e.clientY;


      /*
       * Guarda imagem atual
       */
      currentIndex =
        getClosestIndex();


      track.classList.add(
        'dragging'
      );

    }
  );


  /* ---------------- POINTER MOVE ---------------- */

  track.addEventListener(
    'pointermove',
    (e) => {

      if (!isDown) return;


      const dx =
        e.clientX - startX;

      const dy =
        e.clientY - startY;


      /*
       * Se o movimento for vertical,
       * deixa o navegador fazer scroll
       * normalmente.
       */
      if (
        Math.abs(dy) >
        Math.abs(dx)
      ) {

        return;

      }


      /*
       * Detectou swipe horizontal
       */
      if (
        Math.abs(dx) >=
        SWIPE_DISTANCE
      ) {


        /*
         * Swipe para esquerda
         */
        if (dx < 0) {

          goToCard(
            currentIndex + 1
          );

        }


        /*
         * Swipe para direita
         */
        else {

          goToCard(
            currentIndex - 1
          );

        }


        /*
         * Um swipe só pode
         * mudar uma imagem.
         */
        isDown = false;


        track.classList.remove(
          'dragging'
        );

      }

    }
  );


  /* ---------------- POINTER UP ---------------- */

  track.addEventListener(
    'pointerup',
    () => {

      isDown = false;

      track.classList.remove(
        'dragging'
      );

    }
  );


  /* ---------------- POINTER CANCEL ---------------- */

  track.addEventListener(
    'pointercancel',
    () => {

      isDown = false;

      track.classList.remove(
        'dragging'
      );

    }
  );


  /* ---------------- SCROLL ---------------- */

  track.addEventListener(
    'scroll',
    () => {

      /*
       * Atualiza o indicador
       * quando houver scroll.
       */
      updateDots();

    }
  );


  /* ---------------- IMAGE DRAG ---------------- */

  track.addEventListener(
    'dragstart',
    (e) => {

      e.preventDefault();

    }
  );


  /* ---------------- RESIZE ---------------- */

  window.addEventListener(
    'resize',
    () => {

      goToCard(
        getClosestIndex()
      );

    }
  );


  /* ---------------- FAQ ---------------- */

  const faqItems =
    document.querySelectorAll(
      '.faq__item'
    );


  faqItems.forEach(
    (item) => {

      const question =
        item.querySelector(
          '.faq__question'
        );

      const answer =
        item.querySelector(
          '.faq__answer'
        );


      if (
        !question ||
        !answer
      ) {
        return;
      }


      question.addEventListener(
        'click',
        () => {

          const isOpen =
            item.classList.contains(
              'open'
            );


          /*
           * Fecha todos
           */
          faqItems.forEach(
            (other) => {

              other.classList.remove(
                'open'
              );


              const otherAnswer =
                other.querySelector(
                  '.faq__answer'
                );


              if (otherAnswer) {

                otherAnswer.style.maxHeight =
                  null;

              }

            }
          );


          /*
           * Abre o selecionado
           */
          if (!isOpen) {

            item.classList.add(
              'open'
            );


            answer.style.maxHeight =
              answer.scrollHeight +
              'px';

          }

        }
      );

    }
  );

});
