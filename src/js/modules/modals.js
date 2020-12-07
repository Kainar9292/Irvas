let modalClose;

const modals = (state) => {

    const resetCheck = () => {
        const checkbox = document.querySelectorAll('.checkbox_calc');
        checkbox.forEach(item => {
            item.checked = false;
        });
        document.querySelector('#view_type').value = 'Выберите остекление';
    };

    function bindModal(triggerSelector, 
                       modalSelector, 
                       closeSelector,
                       prop, 
                       propTwo,
                       closeClickOverlay = true, 
                       validation = false) {
        const trigger = document.querySelectorAll(triggerSelector),
              modal = document.querySelector(modalSelector),
              close = document.querySelector(closeSelector),
              windows = document.querySelectorAll('[data-modal]');

        trigger.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target) {
                    e.preventDefault();
                }

                if (validation) {
                    if (!state[prop] || !state[propTwo]) {
                        return;
                    }
                    resetCheck();
                } 
                windows.forEach(item => {
                    item.style.display = 'none';
                });

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';

                modalClose = modalSelector;
                
                // document.body.classList.add('modal-open');
            });
        });

        close.addEventListener('click', () => {
            windows.forEach(item => {
                item.style.display = 'none';
            });
            modal.style.display = 'none';
            document.body.style.overflow = '';
            // document.body.classList.remove('modal-open');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal && closeClickOverlay) {
                windows.forEach(item => {
                    item.style.display = 'none';
                });
                modal.style.display = 'none';
                document.body.style.overflow = '';
                // document.body.classList.remove('modal-open');
            }
        });
    }

    function showModalByTime(selector, time) {
        setTimeout((e) => {
            const modal = document.querySelector(selector).style.display = 'block';
            document.body.style.overflow = 'hidden';
        }, time);
    }

    bindModal('.popup_engineer_btn', '.popup_engineer', '.popup_engineer .popup_close');
    bindModal('.phone_link', '.popup', '.popup .popup_close');
    bindModal('.popup_calc_btn', '.popup_calc', '.popup_calc_close');
    bindModal('.popup_calc_button', '.popup_calc_profile', '.popup_calc_profile_close', 'height', 'width', false, true);
    bindModal('.popup_calc_profile_button', '.popup_calc_end', '.popup_calc_end_close', 'profile',
        'type', false, true);
    // bindModal();
    // showModalByTime('.popup', 40000);
};

export {modalClose};
export default modals;