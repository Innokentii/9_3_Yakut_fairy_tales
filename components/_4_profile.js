import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableWithoutFeedback, ScrollView } from 'react-native';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import {page_translation} from '../App.js';
import NetInfo from '@react-native-community/netinfo';

export let screen_mode = '123'; // состояние режима экрана;
export let language_mode = 'ru'; // состояние языка;
export let ch_your_subscr = false; // ;

export default function App_4_f() {

    //===================================================================================================//
    //                                       Глобальные переменные                                       //
    //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//

    let [app_background, set_app_background] = useState('light'); // (глобальная переменная типа режима фона "светлый или темный");

    // (переменная массив сотояний рабочих блоков);
    const [profile_blocks, set_profile_blocks] = useState([
        { display: '' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
    ]);

    const [apiKey, set_apiKey] = useState('123456789'); // API-ключ;

    // локальная база данных;
    const db = SQLite.openDatabase('mydb.db');

    //===================================================================================================//
    //                                           Функции                                                 //
    //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//

    // Функция обновления сказок при подключению к интернету;
    const [isConnected, setIsConnected] = useState(true);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });
        // Очистка подписки при размонтировании компонента
        return () => unsubscribe();
    }, []);

    // Функция перехода на подраздел "РЕГИСТРАЦИЯ";
    function reg_press_f() {
        set_profile_blocks(prevState => [
            { display: 'none' },
            { display: '' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
        ]);
    };

    // Функция перехода на подраздел "ВХОД";
    function entrance_press_f() {
        set_profile_blocks(prevState => [
            { display: 'none' },
            { display: 'none' },
            { display: '' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
        ]);
    };

    // Функция обратного перехода;
    function back_press_f() {
        set_profile_blocks(prevState => [
            { display: '' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
        ]);
        // сохранение данных;
        db.transaction(
            (tx) => {
                tx.executeSql('UPDATE local_user SET user = ?, password = ?  WHERE id = ?', ['', '', 1], (_, result) => {
                    console.log('Данные успешно обновлены');

                    ch_your_subscr_f();

                });
            },
            (error) => {
                console.error('Error updating data:', error);
            }
        );
        // удаление данных;
        db.transaction(
            (tx) => {
                tx.executeSql('DELETE FROM local_user WHERE id = ?;', [2], (_, result) => {
                    console.log('Row deleted successfully');
                });
            },
            (error) => {
                console.error('Error deleting row:', error);
            }
        );
        // вывод данных;
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    const items = [];
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    //setData(items);
                    console.log(items)
                }
            );
        });
    };

    // Функция переход в раздел "ЛИЧНАЯ ИНФОРМАЦИЯ";
    function per_inf_press_f() {
        set_profile_blocks(prevState => [
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: '' },
            { display: 'none' },
            { display: 'none' },
        ]);
       
    };

    // Функция переход в раздел "ПЛАТЕЖИ";
    function payments_press_f() {
        set_profile_blocks(prevState => [
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: '' },
            { display: 'none' },
        ]);
    };

    // Функция обратного перехода в раздел "Профиль";
    function back_per_inf_press_f() {
        set_profile_blocks(prevState => [
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: '' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
        ]);
    };

    // Функция переход в раздел "Привязать карту";
    function linking_card_f() {
        set_profile_blocks(prevState => [
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: 'none' },
            { display: '' },
        ]);
    };

    // Функция входа в "ЛИЧНАЯ ИНФОРМАЦИЮ" в запуске приложения;
    function open_per_inf_press_f() {
        // вывод данных;
        let work_data = '';
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    const items = [];
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    //setData(items);
                    work_data = items[0]['user'];
                    console.log(work_data);
                    if (work_data != '') {
                        back_per_inf_press_f();
                        WithdrawalOfAccountData(work_data);
                    }
                }
            );
        });
    };
    useEffect(()=>{
        open_per_inf_press_f();
    },[])

    // Функция проверки коректного ввода логина;
    let [login_text, set_login_text] = useState('')
    function login_verification_f(text) {
        
        return text;
    };

    // Функция проверки коректного ввода пароля;
    let [pasw_text, set_pasw_text] = useState('')
    function pasw_verification_f(text) {

        return text;
    };

    // Функция проверки коректного ввода имени;
    let [name_text, set_name_text] = useState('')
    function name_verification_f(text) {
        const allowedCharsRegex = /^[A-Za-zА-Яа-яЁё]+$/;

        if (!allowedCharsRegex.test(text)) {
            // Если введены недопустимые символы, очистить значение
            set_name_text((prevText) => prevText.replace(/[^A-Za-zА-Яа-яЁё]+/g, ''));
        } else {
            set_name_text(text);
        }
    };

    // Функция проверки коректного ввода фамилии;
    let [surname_text, set_surname_text] = useState('')
    function surname_verification_f(text) {
        const allowedCharsRegex = /^[A-Za-zА-Яа-яЁё]+$/;

        if (!allowedCharsRegex.test(text)) {
            // Если введены недопустимые символы, очистить значение
            set_surname_text((prevText) => prevText.replace(/[^A-Za-zА-Яа-яЁё]+/g, ''));
        } else {
            set_surname_text(text);
        }
    };

    // Функция проверки коректного ввода почты;
    let [mail_text, set_mail_text] = useState('')
    function mail_verification_f(text) {
        
        return text;
    };

    // Функция проверки коректного ввода номера телефона;
    let [phone_text, set_phone_text] = useState('')
    function phone_verification_f(text) {
        const digitsOnlyRegex = /^\d*$/;

        if (!digitsOnlyRegex.test(text)) {
            // Если введены недопустимые символы, очистить значение
            set_phone_text((prevText) => prevText.replace(/\D/g, ''));
        } else {
            set_phone_text(text);
        }
    };

    // Функция записи пользователя в БД;
    function user_record_f() {
        if (login_text == '' || pasw_text == '' || name_text == '' || surname_text == '' || mail_text == '' || phone_text == '') {
            console.error('заполните полностью анкету');
        }
        else {
            const fetchDataFromFlaskApp = async () => {
                try {
                    const response = await axios.get(`http://talesofyakutia.ru/api_user_record?api_key=${apiKey}&api_login=${login_text}&api_password=${pasw_text}&api_name=${name_text}&api_surname=${surname_text}&api_mail=${mail_text}&api_phone=${phone_text}`);
                    console.log(response.data)
                    if (response.data == 'запись пользователя удалась') {
                        alert('Вы зарегистрированы');
                        // сохранение данных;
                        db.transaction(
                            (tx) => {
                                tx.executeSql('UPDATE local_user SET user = ?, password = ?  WHERE id = ?', [login_text, pasw_text, 1], (_, result) => {
                                    console.log('Данные успешно обновлены');
                                    ch_your_subscr_f();
                                });
                            },
                            (error) => {
                                console.error('Error updating data:', error);
                            }
                        );
                        open_per_inf_press_f();
                        // удаление данных;
                        db.transaction(
                            (tx) => {
                                tx.executeSql('DELETE FROM local_user WHERE id = ?;', [2], (_, result) => {
                                    console.log('Row deleted successfully');
                                });
                            },
                            (error) => {
                                console.error('Error deleting row:', error);
                            }
                        );
                        // вывод данных;
                        db.transaction((tx) => {
                            tx.executeSql('SELECT * FROM local_user;', [],
                                (txObj, resultSet) => {
                                    const rows = resultSet.rows;
                                    const items = [];
                                    for (let i = 0; i < rows.length; i++) {
                                        items.push(rows.item(i));
                                    };
                                    //setData(items);
                                    console.log(items)
                                }
                            );
                        });
                        back_per_inf_press_f();
                    }
                    if (response.data == 'Логин уже существует') {
                        alert(`Данный логин "${login_text}" занят другим пользователем.`);
                    }  
                } catch (error) {
                    console.error('Ошибка при выполнении API-запроса', error);
                };
            };
            fetchDataFromFlaskApp();
        }
    };

    // Функция проверки коректного ввода логина для входа в Аккаунт;
    let [login_open, set_login_open] = useState('');
    function login_open_verification_f(text) {

        return text;
    };

    // Функция проверки коректного ввода логина для входа в Аккаунт;
    let [password_open, set_password_open] = useState('');
    function password_open_verification_f(text) {

        return text;
    };

    //================================Функция входа в аккаунт================================//
    function secondary_input_f() {
        const fetchDataFromFlaskApp = async () => {
            try {
                const response = await axios.get(`http://talesofyakutia.ru/api_log_in_to_your_account?api_key=${apiKey}&api_login=${login_open}&api_password=${password_open}`);
                console.log(response.data);
                work_data = response.data;
                if (response.data == 'вход в аккаунт') {
                    alert(`Добро пожаловать ${login_open}`);
                    // сохранение данных;
                    db.transaction(
                        (tx) => {
                            tx.executeSql('UPDATE local_user SET user = ?, password = ?  WHERE id = ?', [login_open, password_open, 1], (_, result) => {
                                console.log('Данные успешно обновлены');
                                screen_mode = 'light';
                                ch_your_subscr_f();
                            });
                        },
                        (error) => {
                            console.error('Error updating data:', error);
                        }
                    );
                    open_per_inf_press_f();
                    // удаление данных;
                    db.transaction(
                        (tx) => {
                            tx.executeSql('DELETE FROM local_user WHERE id = ?;', [2], (_, result) => {
                                console.log('Row deleted successfully');
                            });
                        },
                        (error) => {
                            console.error('Error deleting row:', error);
                        }
                    );
                    // вывод данных;
                    db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM local_user;', [],
                            (txObj, resultSet) => {
                                const rows = resultSet.rows;
                                const items = [];
                                for (let i = 0; i < rows.length; i++) {
                                    items.push(rows.item(i));
                                };
                            }
                        );
                    });
                    back_per_inf_press_f();
                }
                if (response.data == 'Логина НЕ существует') {
                    alert(`Логин "${login_open}" не существует.`);
                }
                if (response.data == 'Пароль НЕ правильный') {
                    alert(`Пароль "${password_open}" не правильный.`);
                }
            } catch (error) {
                console.error('Ошибка при выполнении API-запроса', error);
            };
        };
        fetchDataFromFlaskApp();
    };

    //================================Сохранение_данных================================//
    //Функция вывода данных для локально сохраненного аккаунта;
    let [name_save, set_name_save] = useState('1');
    let [surname_save, set_surname_save] = useState('2');
    let [mail_save, set_mail_save] = useState('3');
    let [phone_save, set_phone_save] = useState('4');
    const WithdrawalOfAccountData = async (work_data) => {
        try {
            const response = await axios.get(`http://talesofyakutia.ru/WithdrawalOfAccountData?api_key=${apiKey}&api_login=${work_data}`);
            work_data = (response.data)[0];
            set_name_save(work_data[3]);
            set_surname_save(work_data[4]);
            set_mail_save(work_data[5]);
            set_phone_save(work_data[6]);
            screen_mode = '321';
            console.log(screen_mode)
        } catch (error) {
            console.error('Ошибка WithdrawalOfAccountData', error);
        };
    };

    // Функция проверки коректного ввода имени;
    function name_save_f(text) {
        const allowedCharsRegex = /^[A-Za-zА-Яа-яЁё]+$/;

        if (!allowedCharsRegex.test(text)) {
            // Если введены недопустимые символы, очистить значение
            set_name_save((prevText) => prevText.replace(/[^A-Za-zА-Яа-яЁё]+/g, ''));
        } else {
            set_name_save(text);
        }
    };

    // Функция проверки коректного ввода фамилии;
    function surname_save_f(text) {
        const allowedCharsRegex = /^[A-Za-zА-Яа-яЁё]+$/;

        if (!allowedCharsRegex.test(text)) {
            // Если введены недопустимые символы, очистить значение
            set_surname_save((prevText) => prevText.replace(/[^A-Za-zА-Яа-яЁё]+/g, ''));
        } else {
            set_surname_save(text);
        }
    };

    // Функция проверки коректного ввода почты;
    function mail_save_f(text) {
        
        return text;
    };

    // Функция проверки коректного ввода номера телефона;
    function phone_save_f(text) {
        const digitsOnlyRegex = /^\d*$/;

        if (!digitsOnlyRegex.test(text)) {
            // Если введены недопустимые символы, очистить значение
            set_phone_save((prevText) => prevText.replace(/\D/g, ''));
        } else {
            set_phone_save(text);
        }
    };

    // Функция изменения данных;
    function changing_the_data_f() {
        console.log(123);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    const items = [];
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    console.log(321);
                    //setData(items);
                    work_data = items[0]['user'];
                    console.log(work_data);
                    if (work_data != '') {
                        saving_account_data(work_data);
                    }
                }
            );
        });
        const saving_account_data = async (work_log) => {
            try {
                const response = await axios.get(`http://talesofyakutia.ru/saving_account_data?api_key=${apiKey}&api_login=${work_log}&api_name=${name_save}&api_surname=${surname_save}&api_mail=${mail_save}&api_phone=${phone_save}`);
                work_data = response.data;
                if (work_data == 'данные изменены') {
                    alert(`данные аккаунта ${work_log} изменены.`);
                    back_per_inf_press_f();
                }

            } catch (error) {
                console.error('Ошибка WithdrawalOfAccountData', error);
            };
        };
    };

    //=============================Функция переключения темного и светлого режимов экрана=============================//
    let [button_light_dark_cl, set_button_light_dark_cl] = useState({
        width: 55,
        height: 30,
        borderRadius: 15,
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(16, 24, 40, 1)',
    });

    let [blob_light_dark_cl, set_blob_light_dark_cl] = useState({
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: 'rgba(252, 252, 253, 1)',
    });

    useEffect(() => {
        const items = [];
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    if (items[0]["light_dark"] == 'light') {
                        set_button_light_dark_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)', justifyContent: 'flex-end',}));
                        set_blob_light_dark_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                        set_button_ru_sh_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)'}));
                        set_blob_ru_sh_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                        screen_mode = 'light';
                        set_button_subscription_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)'}));
                        set_blob_subscription_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                        set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                    }
                    else {
                        set_button_light_dark_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)', justifyContent: 'flex-start',}))
                        set_blob_light_dark_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                        set_button_ru_sh_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)'}));
                        set_blob_ru_sh_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                        screen_mode = 'dark';
                        set_button_subscription_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)'}));
                        set_blob_subscription_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                        set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                    }
                });
        });
    }, [])

    function light_dark_f() {
        const items = [];
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    if (items[0]["light_dark"] == 'light') {
                        let light_dark = 'dark';
                        db.transaction(
                            (tx) => {

                                tx.executeSql('UPDATE local_user SET light_dark = ?  WHERE id = ?', [light_dark, 1], (_, result) => {
                                    console.log('темный режим');
                                    set_button_light_dark_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)', justifyContent: 'flex-start',}));
                                    set_blob_light_dark_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                                    set_button_ru_sh_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)'}));
                                    set_blob_ru_sh_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                                    set_button_subscription_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)'}));
                                    set_blob_subscription_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                                    set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                                });
                            },
                            (error) => {
                                console.error('Error updating data:', error);
                            }
                        );
                        screen_mode = light_dark;
                    }
                    else {
                        let light_dark = 'light';
                        db.transaction(
                            (tx) => {
                                
                                tx.executeSql('UPDATE local_user SET light_dark = ?  WHERE id = ?', [light_dark, 1], (_, result) => {
                                    console.log('светлый режим');
                                    set_button_light_dark_cl(prevState => ({ ...prevState, backgroundColor: 'rgba(16, 24, 40, 1)', justifyContent: 'flex-end',}));
                                    set_blob_light_dark_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                                    set_button_ru_sh_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)'}));
                                    set_blob_ru_sh_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                                    set_button_subscription_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)'}));
                                    set_blob_subscription_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                                    set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                                });
                            },
                            (error) => {
                                console.error('Error updating data:', error);
                            }
                        );
                        screen_mode = light_dark;
                    }
                }
            );
        });
    }

    //===============ФУНКЦИИ_ПЕРЕКЛЮЧЕНИЯ_ТЕМНОГО_И_СВЕТЛОГО_РЕЖИМОВ===============//
    let [text_main_cl, set_text_main_cl] = useState({
        fontFamily: 'Roboto',
        fontSize: 29,
        fontWeight: 'bold',
        color: 'rgba(16, 24, 40, 1)',
    })
    let [text_cl, set_text_cl] = useState({
        fontFamily: 'Roboto',
        fontSize: 20,
        color: 'rgba(16, 24, 40, 1)',
    });
    let [registration_button_text_cl, set_registration_button_text_cl] = useState({
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgba(252, 252, 253, 1)',
    });
    let [registration_button_cl, set_registration_button_cl] = useState({
        width: 200,
        height: 60,
        borderWidth: 2,
        borderColor: 'rgba(208, 213, 221, 1)',
        borderRadius: 12,
        backgroundColor: 'rgba(2, 122, 72, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });
    let [arrow, set_arrow] = useState(require('./arrow.png'));
    let [back, set_back] = useState(require('./back.png'));
    let [input_personal_informationcl, set_input_personal_informationcl] = useState({
        width: '100%',
        height: 40,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderRadius: 4,
        paddingLeft: 8,
        paddingVertical: 5,
        fontSize: 20,
    });
    let [input_cl, set_input_cl] = useState({
        width: '60%',
        height: 40,
        borderWidth: 2,
        borderColor: 'rgba(16, 24, 40, 1)',
        borderRadius: 4,
        paddingLeft: 8,
        paddingVertical: 5,
        fontSize: 20,
    });
    let [text_personal_information_cl, set_text_personal_information_cl] = useState({
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgba(16, 24, 40, 1)',
    });
    let [personal_information_button_cl, set_personal_information_button_cl] = useState({
        width: '100%',
        height: 60,
        borderWidth: 2,
        borderRadius: 12,
        backgroundColor: 'rgba(16, 24, 40, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    useEffect(() => {
        const switching_modes = () => {
            if (screen_mode === 'light') {
                set_text_main_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                set_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                set_registration_button_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_registration_button_cl(prevBG => ({ ...prevBG, color: 'rgba(2, 122, 72, 1)' }));
                set_arrow(require('./arrow.png'));
                set_back(require('./back.png'));
                set_input_personal_informationcl(prevBG => ({ ...prevBG, color: 'rgba(0, 0, 0, 1)' }));
                set_input_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                set_text_personal_information_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                set_button_ru_sh_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)'}));
                set_blob_ru_sh_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                set_personal_information_button_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                set_button_subscription_cl(prevState => ({...prevState, backgroundColor: 'rgba(16, 24, 40, 1)'}));
                set_blob_subscription_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            };
            if (screen_mode === 'dark') {
                set_text_main_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_registration_button_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                set_registration_button_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_arrow(require('./arrow_white.png'));
                set_back(require('./back_white.png'));
                set_input_personal_informationcl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_input_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_text_personal_information_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                set_button_ru_sh_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)'}));
                set_blob_ru_sh_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                set_personal_information_button_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
                set_button_subscription_cl(prevState => ({...prevState, backgroundColor: 'rgba(252, 252, 253, 1)'}));
                set_blob_subscription_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
                set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            };
        }
        switching_modes();
    }, [screen_mode])

    const switching_modes = () => {
        db.transaction((tx) => {
            const items = [];
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    if (items[0]["light_dark"] == 'light') {
                        set_text_main_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                        set_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                        set_registration_button_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_registration_button_cl(prevBG => ({ ...prevBG, color: 'rgba(2, 122, 72, 1)' }));
                        set_arrow(require('./arrow.png'));
                        set_back(require('./back.png'));
                        set_input_personal_informationcl(prevBG => ({ ...prevBG, color: 'rgba(0, 0, 0, 1)' }));
                        set_input_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                        set_text_personal_information_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                        set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                    }
                    else {
                        set_text_main_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_registration_button_text_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
                        set_registration_button_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_arrow(require('./arrow_white.png'));
                        set_back(require('./back_white.png'));
                        set_input_personal_informationcl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_input_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_text_personal_information_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                        set_earch_text_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
                    }
                });
        });
    };
    useEffect(() => {
        switching_modes();
    }, []);

    //=============================Функция переключения Русского и Якутского языков=============================//
    let [button_ru_sh_cl, set_button_ru_sh_cl] = useState({
        width: 55,
        height: 30,
        borderRadius: 15,
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(16, 24, 40, 1)',
    });

    let [blob_ru_sh_cl, set_blob_ru_sh_cl] = useState({
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: 'rgba(252, 252, 253, 1)',
    });

    function ru_sh_f() {
        const items = [];
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    if (items[0]["translation"] == 'ru') {
                        let ru_sh = 'sh';
                        db.transaction(
                            (tx) => {
                                tx.executeSql('UPDATE local_user SET translation = ?  WHERE id = ?', [ru_sh, 1], (_, result) => {
                                    console.log('Якутский');
                                    set_button_ru_sh_cl(prevState => ({...prevState, justifyContent: 'flex-start',}));
                                });
                            },
                            (error) => {
                                console.error('Error updating data:', error);
                            }
                        );
                        language_mode = ru_sh;
                    }
                    else {
                        let ru_sh = 'ru';
                        db.transaction(
                            (tx) => {
                                tx.executeSql('UPDATE local_user SET translation = ?  WHERE id = ?', [ru_sh, 1], (_, result) => {
                                    console.log('Русский');
                                    set_button_ru_sh_cl(prevState => ({ ...prevState, justifyContent: 'flex-end',}));
                                });
                            },
                            (error) => {
                                console.error('Error updating data:', error);
                            }
                        );
                        language_mode = ru_sh;
                    }
                }
            );
        });
    }

    useEffect(() => {
        const items = [];
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    for (let i = 0; i < rows.length; i++) {
                        items.push(rows.item(i));
                    };
                    if (items[0]["translation"] == 'ru') {
                        set_button_ru_sh_cl(prevState => ({...prevState, justifyContent: 'flex-end',}));
                    }
                    else {
                        set_button_ru_sh_cl(prevState => ({...prevState, justifyContent: 'flex-start',}));
                    }
                });
        });
    }, []);


    //=============================Функция переключения Русского и Якутского языков=============================//
    let [button_subscription_cl, set_button_subscription_cl] = useState({
        width: 55,
        height: 30,
        borderRadius: 15,
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(16, 24, 40, 1)',
    });

    let [blob_subscription_cl, set_blob_subscription_cl] = useState({
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: 'rgba(252, 252, 253, 1)',
    });

    // Функция подписки на сказки;
    let [placTextCardColor, set_placTextCardColor] = useState('rgba(208, 213, 221, 1)');
    let [search_text_cl, set_earch_text_cl] = useState({
        width: '100%',
        fontSize: 20,
        color: 'rgba(16, 24, 40, 1)',
        borderWidth: 2,
        borderColor: 'green',
        padding: 4,
        paddingLeft: 10,
    });

    // Функция проверки подписки и цены за подписку;
    let [on_of_buttom_cl, set_on_of_buttom_cl] = useState({display: 'flex'});
    let [subscription_price, set_subscription_price] = useState(0);
    let [on_of_buttom_main_cl, set_on_of_buttom_main_cl] = useState({justifyContent: 'flex-end'});
    function ch_your_subscr_f() {
        ch_your_subscr = false;
        db.transaction((tx) => {
            const items = [];
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    const checking_subscription_data = async (work_log) => {
                        try {
                            const response = await axios.get(`http://talesofyakutia.ru/checking_subscription_data?api_key=${apiKey}&api_user=${work_log}`);
                            let work_data = response.data;
                            set_subscription_price(work_data[1]);
                            if (work_data[0] != 'нет') {
                                ch_your_subscr = true;
                                set_on_of_buttom_cl({display: 'none'});
                                set_on_of_buttom_main_cl({justifyContent: 'flex-start'})
                            }
                            else {
                                ch_your_subscr = false;
                                set_on_of_buttom_cl({display: 'flex'});
                                set_on_of_buttom_main_cl({justifyContent: 'flex-end'})
                            }
                        } catch (error) {
                            console.error('Ошибка WithdrawalOfAccountDataXWED', error);
                        };
                    };
                    checking_subscription_data(rows['_array'][0]['user']);
                })
        })
    }
    useEffect(()=>{
        ch_your_subscr_f();
    },[]);

    // Функция оплаты ПОДПИСКИ;
    let [text_inp_1, set_text_inp_1] = useState('1');
    let [text_inp_2, set_text_inp_2] = useState('2');
    let [text_inp_3, set_text_inp_3] = useState('3');
    let [text_inp_4, set_text_inp_4] = useState('4');
    let [text_inp_5, set_text_inp_5] = useState('5');
    function paying_for_a_subsc_f() {
        db.transaction((tx) => {
            const items = [];
            tx.executeSql('SELECT * FROM local_user;', [],
                (txObj, resultSet) => {
                    const rows = resultSet.rows;
                    console.log(rows['_array'][0]['user']);
                    console.log(text_inp_1);
                    console.log(text_inp_2);
                    console.log(text_inp_3);
                    console.log(text_inp_4);
                    console.log(text_inp_5);
                    const paying_for_a_subsc_data = async (work_log) => {
                        try {
                            const response = await axios.get(`http://talesofyakutia.ru/paying_subscription?api_key=${apiKey}&api_user=${work_log}&api_text1=${text_inp_1}&api_text2=${text_inp_2}&api_text3=${text_inp_3}&api_text4=${text_inp_4}&api_text5=${text_inp_5}`);
                            console.log('1A');
                            let work_data = response.data;
                            console.log('1B');
                            console.log(work_data);
                            if (work_data === 'Оплата прошла') {
                                console.log('1C');
                                alert('Подписка оплачена')
                                set_on_of_buttom_cl({display: 'none'});
                                set_on_of_buttom_main_cl({justifyContent: 'flex-start'})
                                ch_your_subscr = true;
                            }
                            if (work_data === 'Оплата НЕ прошла') {
                                alert('Подписка НЕ оплачена. Проверьте данные карты')
                            }
                        } catch (error) {
                            console.error('Ошибка оплаты', error);
                        };
                    };
                    paying_for_a_subsc_data(rows['_array'][0]['user']);
                })
        })
    };
    
    return (
        <View>
            {/*===========================Блок "РЕГ/ВХОД"==============================*/}
            <View style={profile_blocks[0]}>
                <View style={st_catalog.catalog_cl}>
                    <View><Text style={text_main_cl}>Регистрация или вход</Text></View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Регистрация==============================*/}
                        <Text style={text_cl}>Регистрация</Text>
                        <TouchableWithoutFeedback onPress={reg_press_f}>
                            <ImageBackground
                                source={arrow} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                        </TouchableWithoutFeedback>
                        {/*===========================Регистрация==============================*/}
                    </View>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Вход==============================*/}
                        <Text style={text_cl}>Вход</Text>
                        <TouchableWithoutFeedback onPress={entrance_press_f}>
                            <ImageBackground
                                source={arrow} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                        </TouchableWithoutFeedback>
                        {/*===========================Вход==============================*/}
                    </View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                </View>
            </View>
            {/*===========================Блок "РЕГИСТРАЦИЯ"==============================*/}
            <View style={profile_blocks[1]}>
                <View style={st_catalog.catalog_cl}>
                    <View style={st_catalog.subsection_cl}>
                        <TouchableWithoutFeedback onPress={back_press_f}>
                            <ImageBackground
                                source={back} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                        </TouchableWithoutFeedback>
                        <Text style={text_main_cl}>Регистрация</Text>
                        <View style={{ width: 28 }}>{/*_БУФЕР_*/}</View>
                    </View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                    <View style={{height: '210%'}}>
                        <ScrollView style={st_catalog.catalog_scroll_cl}>
                            {/*===========================СКРОЛИНГ_ЗОНА==============================*/}
                            <View style={st_catalog.block_center_cl}>
                                <Text style={text_cl}>Логин:</Text>
                                <TextInput
                                    style={input_cl}
                                    onChangeText={(text) => { set_login_text(text) }}
                                    onKeyPress={login_verification_f}
                                    value={login_text} />
                            </View>
                            <View style={st_catalog.block_center_cl}>
                                <Text style={text_cl}>Пароль:</Text>
                                <TextInput
                                    style={input_cl}
                                    onChangeText={(text) => { set_pasw_text(text) }}
                                    onKeyPress={pasw_verification_f}
                                    value={pasw_text} />
                            </View>
                            <View style={st_catalog.block_center_cl}>
                                <Text style={text_cl}>Введите имя:</Text>
                                <TextInput
                                    style={input_cl}
                                    onChangeText={(text) => { set_name_text(text) }}
                                    onKeyPress={name_verification_f}
                                    value={name_text} />
                            </View>
                            <View style={st_catalog.block_center_cl}>
                                <Text style={text_cl}>Введите фамилию:</Text>
                                <TextInput
                                    style={input_cl}
                                    onChangeText={(text) => { set_surname_text(text) }}
                                    onKeyPress={surname_verification_f}
                                    value={surname_text} />
                            </View>
                            <View style={st_catalog.block_center_cl}>
                                <Text style={text_cl}>Электронная почта:</Text>
                                <TextInput
                                    style={input_cl}
                                    onChangeText={(text) => { set_mail_text(text) }}
                                    onKeyPress={mail_verification_f}
                                    value={mail_text} />
                            </View>
                            <View style={st_catalog.block_center_cl}>
                                <Text style={text_cl}>Контактный номер:</Text>
                                <TextInput
                                    style={input_cl}
                                    onChangeText={(text) => { set_phone_text(text) }}
                                    onKeyPress={phone_verification_f}
                                    value={phone_text} />
                            </View>
                            <View style={st_catalog.block_center_cl}>
                                {/*===========================Кнопка регистрации==============================*/}
                                <TouchableWithoutFeedback onPress={()=>{ if (isConnected===true) {user_record_f()}}}>
                                    <View style={registration_button_cl}>
                                        <Text style={registration_button_text_cl}>Регистрация</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                {/*===========================Кнопка регистрации==============================*/}
                            </View>
                            <View style={{ height: 500}}>{/*БУФЕР*/}</View>
                            {/*===========================СКРОЛИНГ_ЗОНА==============================*/}
                        </ScrollView>
                    </View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                </View>
            </View>
            {/*===========================Блок "ВХОД"==============================*/}
            <View style={profile_blocks[2]}>
                <View style={st_catalog.catalog_cl}>
                    <View style={st_catalog.subsection_cl}>
                        <TouchableWithoutFeedback onPress={back_press_f}>
                            <ImageBackground
                                source={back} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                        </TouchableWithoutFeedback>
                        <Text style={text_main_cl}>Вход</Text>
                        <View style={{ width: 28 }}>{/*_БУФЕР_*/}</View>
                    </View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                    <View style={st_catalog.block_center_cl}>
                        <Text style={text_cl}>Введите логин:</Text>
                        <TextInput
                            style={input_cl}
                            onChangeText={(text) => { set_login_open(text) }}
                            onKeyPress={login_open_verification_f}
                            value={login_open} />
                    </View>
                    <View style={st_catalog.block_center_cl}>
                        <Text style={text_cl}>Введите пароль:</Text>
                        <TextInput
                            style={input_cl}
                            onChangeText={(text) => { set_password_open(text) }}
                            onKeyPress={password_open_verification_f}
                            value={password_open} />
                    </View>
                    <View style={st_catalog.block_center_cl}>
                        {/*===========================Кнопка входа==============================*/}
                        <TouchableWithoutFeedback onPress={()=>{ if (isConnected===true) {secondary_input_f()}}}>
                            <View style={registration_button_cl}>
                                <Text style={registration_button_text_cl}>Войти</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {/*===========================Кнопка входа==============================*/}
                    </View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                </View>
            </View>
            {/*===========================Блок "ПРОФИЛЬ"==============================*/}
            <View style={profile_blocks[3]}>
                <View style={st_catalog.catalog_cl}>
                    <View><Text style={text_main_cl}>Профиль</Text></View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Личная_информация==============================*/}
                        <View style={st_catalog.line_one_cl}>
                            <ImageBackground
                                source={require('./profile-icon.png')} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                            <Text style={text_cl}>Личная информация</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{per_inf_press_f()}}>
                            <ImageBackground
                                source={arrow} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                        </TouchableWithoutFeedback>
                        {/*===========================Личная_информация==============================*/}
                    </View>
                    <View style={st_catalog.line_bottom_cl}>{/*_ЛИНИЯ_*/}</View>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Платежи==============================*/}
                        <View style={st_catalog.line_one_cl}>
                            <ImageBackground
                                source={require('./usd_icon.png')} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                            <Text style={text_cl}>Платежи</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={payments_press_f}>
                            <ImageBackground
                                source={arrow} resizeMode='cover'
                                style={st_catalog.icon_img_cl}></ImageBackground>
                        </TouchableWithoutFeedback>
                        {/*===========================Платежи==============================*/}
                    </View>
                    <View style={st_catalog.line_bottom_cl}>{/*_ЛИНИЯ_*/}</View>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Темный_режим==============================*/}
                        <View style={st_catalog.line_one_cl}>
                            <Text style={text_cl}>Темный_режим</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={light_dark_f}>
                            <View style={button_light_dark_cl}>
                                <View style={blob_light_dark_cl}></View>
                            </View>
                        </TouchableWithoutFeedback>
                        {/*===========================Темный_режим==============================*/}
                    </View>
                    <View style={st_catalog.line_bottom_cl}>{/*_ЛИНИЯ_*/}</View>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Поменять язык Якутский на Рус...   ==============================*/}
                        <View style={st_catalog.line_one_cl}>
                            <Text style={text_cl}>Язык Якутский/Русский   </Text>
                        </View>
                        <TouchableWithoutFeedback onPress={ru_sh_f}>
                            <View style={button_ru_sh_cl}>
                                <View style={blob_ru_sh_cl}></View>
                            </View>
                        </TouchableWithoutFeedback>
                        {/*===========================Поменять язык Якутский на Рус...   ==============================*/}
                    </View>
                    <View style={st_catalog.line_bottom_cl}>{/*_ЛИНИЯ_*/}</View>
                    <View style={st_catalog.line_cl}>
                        {/*===========================Выйти==============================*/}
                        <TouchableWithoutFeedback onPress={back_press_f}>
                            <View style={st_catalog.line_one_cl}>
                                <ImageBackground
                                    source={require('./exit_icon.png')} resizeMode='cover'
                                    style={st_catalog.icon_clouds_img_cl}></ImageBackground>
                                <Text style={text_cl}>Выйти</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        {/*===========================Выйти==============================*/}
                    </View>
                    <ImageBackground
                        source={require('./pattern.png')} resizeMode='cover'
                        style={st_catalog.pattern_cl}></ImageBackground>
                </View>
            </View>
            {/*===========================Блок "Личная информация"==============================*/}
            <View style={profile_blocks[4]}>
                <View style={st_catalog.per_inf_catalog_cl}>
                    <View style={st_catalog.catalog_2_cl}>
                        <View style={st_catalog.subsection_cl}>
                            <TouchableWithoutFeedback onPress={back_per_inf_press_f}>
                                <ImageBackground
                                    source={back} resizeMode='cover'
                                    style={st_catalog.icon_img_cl}></ImageBackground>
                            </TouchableWithoutFeedback>
                            <Text style={text_main_cl}></Text>
                            <View style={{ width: 28 }}>{/*_БУФЕР_*/}</View>
                        </View>
                        <View>
                            <Text style={text_personal_information_cl}>Изменить личную</Text>
                            <Text style={text_personal_information_cl}>информацию</Text>
                        </View>
                        <TextInput
                            onChangeText={(text) => { set_name_save(text) }}
                            onKeyPress={name_save_f}
                            value={name_save}
                            style={input_personal_informationcl}/>
                        <TextInput
                            onChangeText={(text) => { set_surname_save(text) }}
                            onKeyPress={surname_save_f}
                            value={surname_save}
                            style={input_personal_informationcl}/>
                        <TextInput
                            onChangeText={(text) => { set_mail_save(text) }}
                            onKeyPress={mail_save_f}
                            value={mail_save}
                            style={input_personal_informationcl}/>
                        <TextInput 
                            onChangeText={(text) => { set_phone_save(text) }}
                            onKeyPress={phone_save_f}
                            value={phone_save}
                            style={input_personal_informationcl}/>
                    </View>
                    <View style={st_catalog.block_center_cl}>
                        {/*===========================Кнопка сохранения==============================*/}
                        <TouchableWithoutFeedback onPress={() => { if (isConnected==true) {changing_the_data_f()}}}>
                            <View style={personal_information_button_cl}>
                                <Text style={registration_button_text_cl}>Сохранить</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {/*===========================Кнопка сохранения==============================*/}
                    </View>
                </View>
            </View>
            {/*===========================Блок "Платежи"==============================*/}
            <View style={profile_blocks[5]}>
                <View style={st_catalog.per_inf_catalog_cl}>
                    <View style={st_catalog.catalog_cl}>
                        <View style={st_catalog.subsection_cl}>
                            <TouchableWithoutFeedback onPress={back_per_inf_press_f}>
                                <ImageBackground
                                    source={back} resizeMode='cover'
                                    style={st_catalog.icon_img_cl}></ImageBackground>
                            </TouchableWithoutFeedback>
                            <Text style={text_main_cl}></Text>
                            <View style={{ width: 28 }}>{/*_БУФЕР_*/}</View>
                        </View>
                        <View>
                            <Text style={text_personal_information_cl}>Платежи</Text>
                        </View>
                        <View style={st_catalog.line_cl}>
                            {/*===========================Информация_о_карте==============================*/}
                            <View style={st_catalog.line_one_cl}>
                                <ImageBackground
                                    source={require('./profile-icon.png')} resizeMode='cover'
                                    style={st_catalog.icon_img_cl}></ImageBackground>
                                <Text style={text_cl}>Привязать карту</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>{linking_card_f()}}>
                                <ImageBackground
                                    source={arrow} resizeMode='cover'
                                    style={st_catalog.icon_img_cl}></ImageBackground>
                            </TouchableWithoutFeedback>
                            {/*===========================Информация_о_карте==============================*/}
                        </View>
                        <View style={st_catalog.line_bottom_cl}>{/*_ЛИНИЯ_*/}</View>
                        <View style={st_catalog.line_cl}>
                            {/*===========================ПОДПИСКА==============================*/}
                            <View style={st_catalog.line_one_cl}>
                                <Text style={text_cl}>Подписка</Text>
                            </View>
                            <View style={[button_subscription_cl, on_of_buttom_main_cl]}>
                                <View style={blob_subscription_cl}></View>
                            </View>
                            {/*===========================ПОДПИСКА==============================*/}
                        </View>
                    </View>
                </View>
            </View>
            <View style={profile_blocks[6]}>
                <View style={st_catalog.per_inf_catalog_cl}>
                    <View style={st_catalog.catalog_cl}>
                        <View style={st_catalog.subsection_cl}>
                            <TouchableWithoutFeedback onPress={()=>{payments_press_f()}}>
                                <ImageBackground
                                    source={back} resizeMode='cover'
                                    style={st_catalog.icon_img_cl}></ImageBackground>
                            </TouchableWithoutFeedback>
                            <Text style={text_main_cl}></Text>
                            <View style={{ width: 28 }}>{/*_БУФЕР_*/}</View>
                        </View>
                        <View>
                            <Text style={text_personal_information_cl}>Привязать карту</Text>
                        </View>
                        <View style={st_catalog.input_card_line_cl}>
                            {/*===========================запись_данных_о_карте==============================*/}
                            <TextInput
                                placeholderTextColor={placTextCardColor}
                                placeholder='  0000-0000-0000-0000'
                                style={search_text_cl}
                                onChangeText={(text)=>{set_text_inp_1(text)}}
                            />
                            <TextInput
                                placeholderTextColor={placTextCardColor}
                                placeholder='  месяц'
                                style={search_text_cl}
                                onChangeText={(text)=>{set_text_inp_2(text)}}
                            />
                            <TextInput
                                placeholderTextColor={placTextCardColor}
                                placeholder='  год'
                                style={search_text_cl}
                                onChangeText={(text)=>{set_text_inp_3(text)}}
                            />
                            <TextInput
                                placeholderTextColor={placTextCardColor}
                                placeholder='  НАИМЕНОВАНИЕ КАРТЫ'
                                style={search_text_cl}
                                onChangeText={(text)=>{set_text_inp_4(text)}}
                            />
                            <TextInput
                                placeholderTextColor={placTextCardColor}
                                placeholder='  CVV/CVC'
                                style={search_text_cl}
                                onChangeText={(text)=>{set_text_inp_5(text)}}
                            />
                            <View style={on_of_buttom_cl}>
                                <View><Text style={text_personal_information_cl}>Cтоимость подписки: {subscription_price} ₽</Text></View>
                                <TouchableWithoutFeedback onPress={()=>{paying_for_a_subsc_f()}}>
                                    <View style={st_catalog.buttom_subscription_cl}>
                                        <Text style={st_catalog.text_subscription_cl}>Подписка</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {/*===========================запись_данных_о_карте==============================*/}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const st_catalog = StyleSheet.create({
    buttom_subscription_cl: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'rgba(3, 152, 85, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_subscription_cl: {
        color: 'rgba(252, 252, 253, 1)',
        fontSize: 23,
    },
    input_card_line_cl: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    catalog_cl: {
        height: '93%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        paddingLeft: '5%',
        paddingRight: '5%',
        gap: 22,
    },
    catalog_2_cl: {
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        paddingLeft: '5%',
        paddingRight: '5%',
        gap: 22,
    },
    catalog_scroll_cl: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    pattern_cl: {
        width: '100%',
        height: 26,
    },
    line_cl: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    line_one_cl: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    line_bottom_cl: {
        width: '100%',
        height: 1,
        borderWidth: 0.5,
        borderColor: 'rgba(234, 236, 240, 1)',
    },
    icon_img_cl: {
        width: 28,
        height: 28,
    },
    icon_clouds_img_cl: {
        width: 28,
        height: 25,
    },
    button_block_cl: {
        width: 55,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(16, 24, 40, 1)',
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    block_center_cl: {
        height: 75,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    subsection_cl: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    per_inf_catalog_cl: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingLeft: '5%',
        paddingRight: '5%',
        gap: 22,
    },
});