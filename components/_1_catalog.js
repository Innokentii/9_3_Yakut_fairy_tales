import { StatusBar } from 'expo-status-bar';
import {  StyleSheet, View, ImageBackground, Text, FlatList, TouchableWithoutFeedback, Dimensions, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import {screen_mode} from './_4_profile.js';
import {language_mode} from './_4_profile.js';
import {changing_fairy_tale} from './_2_catalog_media.js';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {page_translation} from '../App.js';
import NetInfo from '@react-native-community/netinfo';
import {ch_your_subscr} from './_4_profile.js';

export let changing_main = '123'; // изменение сказки;
export let listen_later = []; // сказки для прослушки по позже;

export default function App_f() {
  
  //===================================================================================================//
  //                                       Глобальные переменные                                       //
  //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//

  const db = SQLite.openDatabase('mydb.db'); // локальная база данных;

  const [apiKey, set_apiKey] = useState('123456789'); // API-ключ;

  let [data_api, set_data_api] = useState([]); // JSON данные об перечне сказок;

  //===================================================================================================//
  //                                            ФУНКЦИИ                                                //
  //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//

  // Функция обновления сказок при подключению к интернету;
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    // Очистка подписки при размонтировании компонента;
    return () => unsubscribe();
  }, []);

  // Функция API-запроса данных сказок с сервера (Python-Flask);
  useEffect(() => {
    // Функция текстового запроса данных сказок;
    const fetchDataFromFlaskApp = async () => {
      try {
        const response = await axios.get(`http://talesofyakutia.ru/api_fairy_tales?api_key=${apiKey}`);
        set_data_api(response.data); // Обновляем сразу, без .response.results;
        set_low_like([]);
        for (let i=1; i<response.data.length+2; i++) {
          set_low_like(prevStyles => [...prevStyles, require('./low_like.png')]);
        }
        set_low_subscription([]);
        for (let i=1; i<response.data.length+2; i++) {
          set_low_subscription(prevStyles => [...prevStyles, 'Подписка']);
        }
      } catch (error) {
        console.error('Ошибка при выполнении API-запроса', error);
      };
    };
    fetchDataFromFlaskApp();
  }, [isConnected]);

  //===============ФУНКЦИИ_ПЕРЕКЛЮЧЕНИЯ_ТЕМНОГО_И_СВЕТЛОГО_РЕЖИМОВ===============//

  let [text_2_cl, set_text_2_cl] = useState({
    fontSize: 29,
    fontWeight: 'bold',
    color: 'rgba(16, 24, 40, 1)',
    fontFamily: 'Roboto',
    color: 'rgba(16, 24, 40, 1)',
    marginVertical: 15,
  });
  let [gen_text_main_1_cl, set_gen_text_main_1_cl] = useState(
    { color: 'rgba(16, 24, 40, 1)', fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold' }
  );
  let [gen_text_main_2_cl, set_gen_text_main_2_cl] = useState(
    { display: 'none', color: 'rgba(16, 24, 40, 1)', fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold' }
  );
  let [gen_text_main_3_cl, set_gen_text_main_3_cl] = useState(
    { color: 'rgba(102, 112, 133, 1)', fontSize: 14, fontFamily: 'Roboto' }
  );
  let [gen_text_main_4_cl, set_gen_text_main_4_cl] = useState(
    { display: 'none', color: 'rgba(102, 112, 133, 1)', fontSize: 14, fontFamily: 'Roboto' }
  );
  let [gen_block_cl, set_gen_block_cl] = useState({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    backgroundColor: 'rgba(242, 244, 247, 1)'
  });

  // Детонатор функции "switching_modes_1";
  let [x, set_x] = useState(screen_mode);
  let [z, set_z] = useState(changing_fairy_tale);
  function x_f () {
    set_x(screen_mode);
    set_z(changing_fairy_tale);
  };
  useState(()=>{
    setInterval(() => {x_f()}, 500);
  },[])

  // Функции изменение цвета при темном и светлом режимах;
  let [low_like, set_low_like] = useState([]);
  let [low_subscription, set_low_subscription] = useState([]);
  const switching_modes_1 = () => {
    db.transaction((tx) => {
      const items = [];
      tx.executeSql('SELECT * FROM local_user;', [],
        (txObj, resultSet) => {
          const rows = resultSet.rows;
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          };
          console.log(items);
          const info_subscription = async () => {
            try {
              const response = await axios.get(`http://talesofyakutia.ru/info_subscription?api_key=${apiKey}&api_user=${items[0]["user"]}`);
              work_text = response.data;
              work_text = work_text.split(',');
              set_low_subscription([]);
              for (let i=1; i<data_api.length+2; i++) {
                if (work_text.includes(String(i))) {set_low_subscription(prevStyles => [...prevStyles, 'Есть']);}
                else {set_low_subscription(prevStyles => [...prevStyles, 'Подписка']);}
              }
            } catch (error) {
              console.log('Ошибка при выполнении API-запросаYUI', error);
            };
          };
          info_subscription();
          if (items[0]["light_dark"] == 'light') {
            set_text_2_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_gen_text_main_1_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_gen_text_main_2_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_gen_text_main_3_cl(prevBG => ({ ...prevBG, color: 'rgba(102, 112, 133, 1)' }));
            set_gen_text_main_4_cl(prevBG => ({ ...prevBG, color: 'rgba(102, 112, 133, 1)' }));
            set_gen_block_cl(prevState => ({ ...prevState, backgroundColor: 'rgba(242, 244, 247, 1)' }));
            const info_like = async () => {
              try {
                const response = await axios.get(`http://talesofyakutia.ru/info_like?api_key=${apiKey}&api_user=${items[0]["user"]}`);
                work_text = response.data;
                work_text = work_text.split(',');
                set_low_like([]);
                for (let i=1; i<data_api.length+2; i++) {
                  if (work_text.includes(String(i))) {set_low_like(prevStyles => [...prevStyles, require('./white_likes.png')]);}
                  else {set_low_like(prevStyles => [...prevStyles, require('./low_like.png')]);}
                }
              } catch (error) {
                console.log('Ошибка при выполнении API-запроса', error);
              };
            };
            info_like();

            //___Информация о сказке_____//
            set_work_text_1_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_work_text_2_cl(prevBG => ({ ...prevBG, color: 'rgba(102, 112, 133, 1)' }));
            set_work_text_3_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_work_text_4_cl(prevBG => ({ ...prevBG, color: 'rgba(102, 112, 133, 1)' }));
            set_work_text_5_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_control_button_cl(prevBG => ({ ...prevBG, backgroundColor: '#EAECF0' }));
            set_control_text_1_cl(prevBG => ({ ...prevBG, color: 'rgba(0, 0, 0, 1)' }));
            set_control_text_2_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_control_img_1_cl(require('./white_arrow.png'));
            set_control_img_3_cl(require('./date_publick_white.png'));
            set_control_img_4_cl(require('./timer_white.png'));
            set_control_img_5_cl(require('./genre_white.png'));
            set_control_img_6_cl(require('./volume_white.png'));
            set_control_img_7_cl(require('./age_white.png'));
            set_control_img_8_cl(require('./load_white.png'));
            set_control_img_9_cl(require('./earphone_white.png'));
            set_stop_mp3_cl(require('./stop_mp3_white.png'));
            set_start_mp3_cl(require('./start_mp3_white.png'));
            set_boots_mp3_cl(require('./boots_mp3_white.png'));
            set_control_text_3_cl(prevBG => ({ ...prevBG, color: 'rgba(16, 24, 40, 1)' }));
            set_pause_mp3_cl(require('./pause_mp3_white.png'));
          }
          else {
            set_text_2_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_gen_text_main_1_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_gen_text_main_2_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_gen_text_main_3_cl(prevBG => ({ ...prevBG, color: 'rgba(152, 162, 179, 1)' }));
            set_gen_text_main_4_cl(prevBG => ({ ...prevBG, color: 'rgba(152, 162, 179, 1)' }));
            set_gen_block_cl(prevState => ({ ...prevState,backgroundColor: 'rgba(52, 64, 84, 1)' }));
            const info_like = async () => {
              try {
                const response = await axios.get(`http://talesofyakutia.ru/info_like?api_key=${apiKey}&api_user=${items[0]["user"]}`);
                work_text = response.data;
                work_text = work_text.split(',');
                set_low_like([]);
                for (let i=1; i<data_api.length+1; i++) {
                  if (work_text.includes(String(i))) {set_low_like(prevStyles => [...prevStyles, require('./black_likes.png')]);}
                  else {set_low_like(prevStyles => [...prevStyles, require('./low_like_black.png')]);}
                }
              } catch (error) {
                console.log('Ошибка при выполнении API-запросаXXX', error);
              };
            };
            info_like();

            //___Информация о сказке_____//
            set_work_text_1_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_work_text_2_cl(prevBG => ({ ...prevBG, color: 'rgba(102, 112, 133, 1)' }));
            set_work_text_3_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_work_text_4_cl(prevBG => ({ ...prevBG, color: 'rgba(102, 112, 133, 1)' }));
            set_work_text_5_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_control_button_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(52, 64, 84, 1)' }));
            set_control_text_1_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_control_text_2_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_control_img_1_cl(require('./black_arrow.png'));
            set_control_img_3_cl(require('./date_publick_black.png'));
            set_control_img_4_cl(require('./timer_black.png'));
            set_control_img_5_cl(require('./genre_black.png'));
            set_control_img_6_cl(require('./volume_black.png'));
            set_control_img_7_cl(require('./age_black.png'));
            set_control_img_8_cl(require('./load_black.png'));
            set_control_img_9_cl(require('./earphone_black.png'));
            set_stop_mp3_cl(require('./stop_mp3_black.png'));
            set_start_mp3_cl(require('./start_mp3_black.png'));
            set_boots_mp3_cl(require('./boots_mp3_black.png'));
            set_control_text_3_cl(prevBG => ({ ...prevBG, color: 'rgba(252, 252, 253, 1)' }));
            set_pause_mp3_cl(require('./pause_mp3_black.png'));
          };
        });
    });
  };
  useEffect(()=>{
    switching_modes_1();
  },[x,data_api,z]);

  //=============================Функция переключения Русского и Якутского языков=============================//

  // Детонатор функции "language_modes_2";
  let [y, set_y] = useState(language_mode);
  function y_f() {
    set_y(language_mode);
  };
  useState(() => {
    setInterval(() => { y_f() }, 500);
  }, [])

  // Функции изменения языка;
  const language_modes_2 = () => {
    db.transaction((tx) => {
      const items = [];
      tx.executeSql('SELECT * FROM local_user;', [],
        (txObj, resultSet) => {
          const rows = resultSet.rows;
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          };
          if (items[0]["translation"] == 'ru') {
            set_gen_text_main_1_cl(prevDisp => ({ ...prevDisp, display: 'flex' }));
            set_gen_text_main_2_cl(prevDisp => ({ ...prevDisp, display: 'none' }));
            set_gen_text_main_3_cl(prevDisp => ({ ...prevDisp, display: 'flex' }));
            set_gen_text_main_4_cl(prevDisp => ({ ...prevDisp, display: 'none' }));
          }
          else {
            set_gen_text_main_1_cl(prevDisp => ({ ...prevDisp, display: 'none' }));
            set_gen_text_main_2_cl(prevDisp => ({ ...prevDisp, display: 'flex' }));
            set_gen_text_main_3_cl(prevDisp => ({ ...prevDisp, display: 'none' }));
            set_gen_text_main_4_cl(prevDisp => ({ ...prevDisp, display: 'flex' }));
          }
        });
    });
  };
  useEffect(() => {
    language_modes_2();
  }, [y]);

  //======================Функция установки лайков======================//
  function installing_a_like_f(id_data) {
    let id_user = '';
    db.transaction((tx) => {
      const items = [];
      tx.executeSql('SELECT * FROM local_user;', [],
        (txObj, resultSet) => {
          const rows = resultSet.rows;
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          };
          id_user = items[0]['user'];
          fetchDataFromFlaskApp(id_data, id_user);
        });
    });
    const fetchDataFromFlaskApp = async (id_data, id_user) => {
      try {
        const response = await axios.get(`http://talesofyakutia.ru/installing_a_like_f?api_key=${apiKey}&api_like=${id_data}&api_user=${id_user}`);
        let req = require('./low_like.png');
        let req_like = require('./white_likes.png');
        if (screen_mode === 'light') {
          req = require('./low_like.png');
          req_like = require('./white_likes.png');
        };
        if (screen_mode === 'dark') {
          req = require('./low_like_black.png');
          req_like = require('./black_likes.png');
        };
        if (response.data === 'лайк засчитан') {
          let work_arrow = [];
          for (let i = 0; i < low_like.length; i++) {
            if (i === (id_data - 1)) { work_arrow.push(req_like) }
            else { work_arrow.push(low_like[i]) }
          }
          console.log('лайк засчитан');
          set_low_like(work_arrow);
          changing_main = id_data;
        };
        if (response.data === 'лайк удален') {
          let work_arrow = [];
          for (let i = 0; i < low_like.length; i++) {
            if (i === (id_data - 1)) { work_arrow.push(req) }
            else { work_arrow.push(low_like[i]) }
          }
          console.log('лайк удален');
          set_low_like(work_arrow);
        };
      } catch (error) {
        console.error('Ошибка X', error);
      };
    };
  };

  //======================Функция установки подписки======================//
  function installing_a_subscription_f(id_data) {
    let id_user = '';
    db.transaction((tx) => {
      const items = [];
      tx.executeSql('SELECT * FROM local_user;', [],
        (txObj, resultSet) => {
          const rows = resultSet.rows;
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          };
          id_user = items[0]['user'];
          fetchDataFromFlaskApp(id_data, id_user);
        });
    });
    const fetchDataFromFlaskApp = async (id_data, id_user) => {
      try {
        const response = await axios.get(`http://talesofyakutia.ru/installing_a_subscription_f?api_key=${apiKey}&api_subscription=${id_data}&api_user=${id_user}`);
        let req = 'Подписка';
        let req_like = 'Есть';
        if (response.data === 'подписка засчитана') {
          let work_arrow = [];
          for (let i = 0; i < low_subscription.length; i++) {
            if (i === (id_data - 1)) { work_arrow.push(req_like) }
            else { work_arrow.push(low_subscription[i]) }
          }
          console.log('подписка засчитана');
          set_low_subscription(work_arrow);
          changing_main = `${id_data}A`;
        };
        if (response.data === 'подписка удалена') {
          let work_arrow = [];
          for (let i = 0; i < low_subscription.length; i++) {
            if (i === (id_data - 1)) { work_arrow.push(req) }
            else { work_arrow.push(low_subscription[i]) }
          }
          console.log('подписка удалена');
          set_low_subscription(work_arrow);
          changing_main = `${id_data}B`;
        };
      } catch (error) {
        console.error('Ошибка Y', error);
      };
    };
  };

  //=================Функция запуска режима просмотра описания сказки=================//
  let [catalog_mini_1_cl, set_catalog_mini_1_cl] = useState({height: '97%',});
  let [catalog_mini_2_cl, set_catalog_mini_2_cl] = useState({
    width: '100%',
    height: '115%',
    overflow: 'scroll',
    display: 'none',
  });
  const { width } = Dimensions.get('window');

  let [work_text_1_cl, set_work_text_1_cl] = useState({
    marginTop: 20,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(16, 24, 40, 1)',
  });
  let [work_text_2_cl, set_work_text_2_cl] = useState({
    fontSize: 16,
    color: 'rgba(102, 112, 133, 1)',
    marginBottom: 10,
  });
  let [work_text_3_cl, set_work_text_3_cl] = useState({
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(16, 24, 40, 1)',
    marginTop: 20,
    marginBottom: 20,
  });
  let [work_text_4_cl, set_work_text_4_cl] = useState({
    fontSize: 14,
    color: 'rgba(102, 112, 133, 1)',
  });
  let [work_text_5_cl, set_work_text_5_cl] = useState({
    fontSize: 14,
    color: 'rgba(16, 24, 40, 1)',
  });
  let [control_button_cl, set_control_button_cl] = useState({
    width: 171,
    paddingVertical: 8,
    backgroundColor: '#EAECF0',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  });
  let [control_text_1_cl, set_control_text_1_cl] = useState({
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
  })
  let [control_text_2_cl, set_control_text_2_cl] = useState({
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(252, 252, 253, 1)',
  })
  let [control_img_1_cl, set_control_img_1_cl] = useState(require('./white_arrow.png'));
  let [control_img_3_cl, set_control_img_3_cl] = useState(require('./date_publick_white.png'));
  let [control_img_4_cl, set_control_img_4_cl] = useState(require('./timer_white.png'));
  let [control_img_5_cl, set_control_img_5_cl] = useState(require('./genre_white.png'));
  let [control_img_6_cl, set_control_img_6_cl] = useState(require('./volume_white.png'));
  let [control_img_7_cl, set_control_img_7_cl] = useState(require('./age_white.png'));
  let [control_img_8_cl, set_control_img_8_cl] = useState(require('./load_white.png'));
  let [control_img_9_cl, set_control_img_9_cl] = useState(require('./earphone_white.png'));

  // Функция открытия описания сказки;
  let [id_, set_id_] = useState('');
  let [name_, set_name_] = useState('');
  let [genre_, set_genre_] = useState('');
  let [description_, set_description_] = useState('');
  let [date_publication_, set_date_publication_] = useState('');
  let [duration_, set_duration_] = useState('');
  let [volume_, set_volume_] = useState('');
  let [age_, set_age_] = useState('');
  function switching_description_open_f(id) {
    if (ch_your_subscr == true) {
      set_catalog_mini_1_cl({ display: 'none', height: '97%'});
      set_catalog_mini_2_cl({ display: 'flex', width: '100%', height: '115%', overflow: 'scroll',});
      set_id_(data_api[id][0]); //id;
      db.transaction((tx) => {
        const items = [];
        tx.executeSql('SELECT * FROM local_user;', [],
          (txObj, resultSet) => {
            const rows = resultSet.rows;
            for (let i = 0; i < rows.length; i++) {
              items.push(rows.item(i));
            };
            if (items[0]["translation"] == 'ru') {
              set_name_(data_api[id][1]); //название на Русском;
              set_genre_(data_api[id][7]); //жанр на Русском;
              set_description_(data_api[id][3]); //описание на Русском;
            } 
            else {
              set_name_(data_api[id][2]); //название на Якутском;
              set_genre_(data_api[id][8]); //жанр на Русском;
              set_description_(data_api[id][4]); //описание на Якутском;
            }; 
          });
      });
      set_date_publication_(data_api[id][5]); //дата загрузки;
      set_duration_(data_api[id][6]); //продолжительность;
      set_volume_(data_api[id][9]); //Вес аудио;
      set_age_(data_api[id][10]); //Возраст;
    }
    else {
      alert('Купите подписку')
    }
  }

  // Функция закрытия описания сказки;
  function switching_description_close_f() {
    set_catalog_mini_1_cl({ display: 'flex', height: '97%'});
    set_catalog_mini_2_cl({ display: 'none', width: '100%', height: '115%', overflow: 'scroll',});
    set_control_work_1_cl({
      paddingVertical: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    });
    set_control_work_2_cl({
      display: 'none',
    });
    listen_to_music_close_f();
  };

  // Функция слушать позже;
  function listen_later_f(id) {
    if (listen_later.includes(id)==false) {listen_later.push(id)};
    console.log(listen_later);
    alert('Сказка переведён на раздел "Медиатека/Слушаю"');
  };

  // Функция слушания сказки;
  let [control_work_1_cl, set_control_work_1_cl] = useState({
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  });
  let [control_work_2_cl, set_control_work_2_cl] = useState({
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    display: 'none',
  });
  let [control_text_3_cl, set_control_text_3_cl] = useState({
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(16, 24, 40, 1)',
  });
  let [stop_mp3_cl, set_stop_mp3_cl] = useState(require('./stop_mp3_white.png'));
  let [start_mp3_cl, set_start_mp3_cl] = useState(require('./start_mp3_white.png'));
  let [pause_mp3_cl, set_pause_mp3_cl] = useState(require('./pause_mp3_white.png'));
  let [boots_mp3_cl, set_boots_mp3_cl] = useState(require('./boots_mp3_white.png'));

  // Открытие панели управления аудио сказки;
  function listen_to_music_open_f() {
    set_control_work_1_cl({
      display: 'none',
    });
    set_control_work_2_cl({
      paddingVertical: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    });
  };
  // Остановка сказки;
  function listen_to_music_close_f() {
    set_control_work_1_cl({
      paddingVertical: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    });
    set_control_work_2_cl({
      display: 'none',
    });
    listen_to_music_pause_f();
    const stopSound = async () => {
      if (sound) {
        await sound.stopAsync();
      }
    };
    stopSound();
    const unloadSound = async () => {
      const changeRate = (newRate) => {
        if (sound) {
          sound.setRateAsync(1.0, true); // Устанавливаем новую скорость воспроизведения
          setRate(newRate); // Сохраняем новую скорость в состоянии
        }
      };
      changeRate(1.0);
      set_acceleration_text('1X');
      if (sound) {
        await sound.unloadAsync();
        setPosition(null);
        setSound(null);
      }
    };
    unloadSound();
  };

  let [start_mp3, set_start_mp3] = useState({ display: 'flex' });
  let [pause_mp3, set_pause_mp3] = useState({ display: 'none' });
  let [position, setPosition] = useState(null);
  let [rate, setRate] = useState(1.0);
  let [acceleration_text, set_acceleration_text] = useState('1X');
  // старт сказки;
  let [sound, setSound] = useState('');
  function listen_to_music_start_f() {
    set_start_mp3({ display: 'none' });
    set_pause_mp3({ display: 'flex' });
    if (position == null) {
      const playSound = async (id) => {
        const { sound } = await Audio.Sound.createAsync(
          { uri: `http://talesofyakutia.ru/static/aud/aud_id_${id}.mp3`},
          { shouldPlay: true, position, rate }
        );
        setSound(sound)
      };
      playSound(id_);
    }
    else {
      const resumeSound = async () => {
        if (sound) {
          const status = await sound.playAsync();
          setPosition(status.positionMillis); // Сохраняем текущую позицию
        }
      };
      resumeSound();
    };
  };
  // пауза сказки;
  function listen_to_music_pause_f() {
    set_start_mp3({ display: 'flex' });
    set_pause_mp3({ display: 'none' });
    const pauseSound = async () => {
      if (sound) {
        const status = await sound.pauseAsync();
        setPosition(status.positionMillis);
      }
    };
    pauseSound();
  };
  // ускорение сказки;
  function audio_acceleration_f() {
    if (acceleration_text === '1X') {
      const changeRate = (newRate) => {
        if (sound) {
          sound.setRateAsync(3.0, true); // Устанавливаем новую скорость воспроизведения
          setRate(newRate); // Сохраняем новую скорость в состоянии
        }
      };
      changeRate(3.0);
      set_acceleration_text('3X');
    }
    else {
      const changeRate = (newRate) => {
        if (sound) {
          sound.setRateAsync(1.0, true); // Устанавливаем новую скорость воспроизведения
          setRate(newRate); // Сохраняем новую скорость в состоянии
        }
      };
      changeRate(1.0);
      set_acceleration_text('1X');
    }
  };

  // Функция загрузки на локальную папку;
  async function downloadAndSaveAudio(id) {
    const source = `http://talesofyakutia.ru/static/aud/aud_id_${id}.mp3`;
    const filename = `audio_${id}.mp3`;
    console.log(id);
    const folderPath = FileSystem.documentDirectory + 'components/audio'; // Замените 'audio' на нужное вам имя папки
    try {
      // Проверяем, существует ли папка, и если нет, создаем ее;
      const folderInfo = await FileSystem.getInfoAsync(folderPath);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      }
      // Полный путь к файлу в папке
      const filePath = `${folderPath}/${filename}`;

      // Проверяем, существует ли файл в папке;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        alert('Файл уже существует в папке');
        // Удаление файла
        await FileSystem.deleteAsync(filePath);
        console.log('Файл успешно удален');
      }
      else {
        alert('Сказка загружается');
      }
      // Загрузка аудиофайла с сервера;
      const { uri } = await FileSystem.downloadAsync(source, filePath);
      alert('Аудио успешно загружено и сохранено в папке:', uri);
    } catch (error) {
      alert('Ошибка при загрузке и сохранении аудио:', error);
    }
  };

  // Функция переключения страниц;
  let [page_tran, set_page_translation] = useState(page_translation);
  function page_tran_f() {
    set_page_translation(page_translation);
  };
  useState(() => {
    setInterval(() => { page_tran_f() }, 500);
  }, []);
  useEffect(()=>{
    switching_description_close_f();
  },[page_tran]);

  // Детонатор функции "hiding_subscr_button_f";
  let [w_det, set_W] = useState(ch_your_subscr);
  function w_det_f() {
    set_W(ch_your_subscr);
  };
  setInterval(() => { w_det_f() }, 500);

  // Функция скрытие кнопки подписки;
  let [subscription_button, set_subscription_button] = useState({display: 'flex'});
  const hiding_subscr_button_f = () => {
    console.log('GJkexbkjcm');
    console.log(w_det);
    if (w_det == true) {
      set_subscription_button({display: 'none'});
    }
    else {
      set_subscription_button({display: 'flex'});
    }
  };
  useEffect(()=>{
    hiding_subscr_button_f()
  },[w_det]);

  // Функция нажатия на кнопку "Купите подписку и слушайте везде";
  function buy_subscription_f() {
    alert('зарегистрируйтесь и потом на меню ("Профиль") зайдите "Платежи" -> "Привязать карту". Заполните данные платежной карты и нажмите кнопку "Подписка"')
  };

  return (
    <View style={st_catalog.catalog_cl}>
      <View style={catalog_mini_1_cl}>
        <TouchableWithoutFeedback onPress={()=>{buy_subscription_f()}}>
          <View style={[st_catalog.glob_subsc_button_cl, subscription_button]}>
            <Text style={st_catalog.text_1_cl}>Купите подписку и слушайте везде</Text>
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={text_2_cl}>Каталог</Text>
        </View>
        <ImageBackground
          source={require('./pattern.png')} resizeMode='cover'
          style={st_catalog.pattern_cl}></ImageBackground>
        <View style={st_catalog.catalog_list_cl}>
          {/*===========================СКРОЛИНГ_ЗОНА_ДЛЯ_СКАЗОК==============================*/}
          <FlatList style={st_catalog.gen_flast_cl} data={data_api} renderItem={({ item }) => (
            <View style={st_catalog.gen_main_block_cl}>
              <View style={gen_block_cl}>
                <TouchableWithoutFeedback onPress={() => { switching_description_open_f(item[0] - 1) }}>
                  <ImageBackground
                    source={{ uri: `http://talesofyakutia.ru/static/img_1/img_id_${item[0]}.jpg` }}
                    resizeMode='cover'
                    style={st_catalog.fairy_tale_icon_cl}
                    onError={(error) => console.error('Ошибка при загрузке изображения', error)}>
                  </ImageBackground>
                </TouchableWithoutFeedback>
                <View style={st_catalog.gen_block_info_cl}>
                  <View style={st_catalog.gen_block_text_cl}>
                    <Text style={gen_text_main_1_cl}>{item[1]}</Text>
                    <Text style={gen_text_main_2_cl}>{item[2]}</Text>
                    <Text style={gen_text_main_3_cl}>{item[7]}</Text>
                    <Text style={gen_text_main_4_cl}>{item[8]}</Text>
                  </View>
                  <View style={st_catalog.gen_block_footer_cl}>
                    <TouchableWithoutFeedback onPress={() => { installing_a_like_f(item[0]) }}>
                      <ImageBackground
                        source={low_like[item[0] - 1]} resizeMode='cover'
                        style={st_catalog.like_img_cl}></ImageBackground>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { installing_a_subscription_f(item[0]) }}>
                      <View style={st_catalog.gen_block_button_cl}>
                        <Text style={st_catalog.gen_button_text_cl}>{low_subscription[item[0] - 1]}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
              <ImageBackground
                source={require('./pattern.png')} resizeMode='cover'
                style={st_catalog.pattern_cl}></ImageBackground>
            </View>
          )} />
          {/*===========================СКРОЛИНГ_ЗОНА_ДЛЯ_СКАЗОК==============================*/}
        </View>
      </View>

      {/*=============ОПИСАНИЕ_СКАЗКИ=============*/}
      <View style={catalog_mini_2_cl}>
        <ScrollView>
          <ImageBackground
            source={{ uri: `http://talesofyakutia.ru/static/img_1/img_id_${id_}.jpg` }}
            resizeMode='cover'
            style={[st_catalog.buttom_image_cl, { height: width * 0.85 }]}
          >
            <View style={st_catalog.buttom_block_cl}>
              <TouchableWithoutFeedback onPress={() => { switching_description_close_f() }}>
                <ImageBackground
                  source={control_img_1_cl}
                  resizeMode='cover'
                  style={st_catalog.buttom_image_1_2_cl}>{/*_кнопка "НАЗАД"_*/}</ImageBackground>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => { installing_a_like_f(id_) }}>
                <ImageBackground
                  source={low_like[id_ - 1]}
                  resizeMode='cover'
                  style={st_catalog.buttom_image_1_2_cl}>{/*_кнопка "ЛАЙК"_*/}</ImageBackground>
              </TouchableWithoutFeedback>
            </View>
          </ImageBackground>
          <View><Text style={work_text_1_cl}>{name_}</Text></View>
          <View><Text style={work_text_2_cl}>{genre_}</Text></View>
          <View><Text style={work_text_2_cl}>{description_}</Text></View>
          <ImageBackground
            source={require('./pattern.png')} resizeMode='cover'
            style={st_catalog.pattern_cl}></ImageBackground>
          <View><Text style={work_text_3_cl}>Описание</Text></View>
          <View style={st_catalog.work_block_cl}>
            <View style={st_catalog.work_list_cl}>
              <View style={st_catalog.work_list_child_cl}>
                <ImageBackground
                  source={control_img_3_cl} resizeMode='cover'
                  style={st_catalog.img_cl}></ImageBackground>
                <View><Text style={work_text_4_cl}>Дата публикации</Text></View>
              </View>
              <View><Text style={work_text_5_cl}>{date_publication_}</Text></View>
            </View>
            <View style={st_catalog.work_list_cl}>
              <View style={st_catalog.work_list_child_cl}>
                <ImageBackground
                  source={control_img_4_cl} resizeMode='cover'
                  style={st_catalog.img_cl}></ImageBackground>
                <View><Text style={work_text_4_cl}>Продолжительность</Text></View>
              </View>
              <View><Text style={work_text_5_cl}>{duration_}</Text></View>
            </View>
            <View style={st_catalog.work_list_cl}>
              <View style={st_catalog.work_list_child_cl}>
                <ImageBackground
                  source={control_img_5_cl} resizeMode='cover'
                  style={st_catalog.img_cl}></ImageBackground>
                <View><Text style={work_text_4_cl}>Жанр</Text></View>
              </View>
              <View><Text style={work_text_5_cl}>{genre_}</Text></View>
            </View>
            <View style={st_catalog.work_list_cl}>
              <View style={st_catalog.work_list_child_cl}>
                <ImageBackground
                  source={control_img_6_cl} resizeMode='cover'
                  style={st_catalog.img_cl}></ImageBackground>
                <View><Text style={work_text_4_cl}>Обьем</Text></View>
              </View>
              <View><Text style={work_text_5_cl}>{volume_ + ' МБ'}</Text></View>
            </View>
            <View style={st_catalog.work_list_cl}>
              <View style={st_catalog.work_list_child_cl}>
                <ImageBackground
                  source={control_img_7_cl} resizeMode='cover'
                  style={st_catalog.img_cl}></ImageBackground>
                <View><Text style={work_text_4_cl}>Возраст</Text></View>
              </View>
              <View><Text style={work_text_5_cl}>{age_ + '+'}</Text></View>
            </View>
          </View>
          <ImageBackground
            source={require('./pattern.png')} resizeMode='cover'
            style={st_catalog.pattern_cl}></ImageBackground>
        </ScrollView>

        <View style={control_work_1_cl}>
          <View style={st_catalog.control_child_work_cl}>
            <TouchableWithoutFeedback onPress={() => { if (isConnected===true) {downloadAndSaveAudio(id_)}}}>
              <View style={control_button_cl}>
                <ImageBackground
                  source={control_img_8_cl} resizeMode='cover'
                  style={st_catalog.control_img_cl}></ImageBackground>
                <Text style={control_text_1_cl}>Скачать</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => { if (isConnected===true) {listen_later_f(id_) }}}>
              <View style={control_button_cl}>
                <ImageBackground
                  source={control_img_9_cl} resizeMode='cover'
                  style={st_catalog.control_img_cl}></ImageBackground>
                <Text style={control_text_1_cl}>Слушать позже</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={st_catalog.control_main_button_cl}>
            <TouchableWithoutFeedback onPress={() => { listen_to_music_open_f() }}>
              <Text style={control_text_2_cl}>Слушать</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={control_work_2_cl}>
          <View style={st_catalog.control_child_work_2_cl}>
            <TouchableWithoutFeedback onPress={() => { if (isConnected===true) {listen_to_music_close_f() }}}>
              <ImageBackground
                source={stop_mp3_cl} resizeMode='cover'
                style={st_catalog.control_img_2_cl}></ImageBackground>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => { if (isConnected===true) {listen_to_music_start_f() }}}>
              <ImageBackground
                source={start_mp3_cl} resizeMode='cover'
                style={[st_catalog.control_img_2_cl, start_mp3]}></ImageBackground>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => { if (isConnected===true) {listen_to_music_pause_f() }}}>
              <ImageBackground
                source={pause_mp3_cl} resizeMode='cover'
                style={[st_catalog.control_img_2_cl, pause_mp3]}></ImageBackground>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => { if (isConnected===true) {audio_acceleration_f() }}}>
              <ImageBackground
                source={boots_mp3_cl} resizeMode='cover'
                style={st_catalog.control_img_2_cl}></ImageBackground>
            </TouchableWithoutFeedback>
            <Text style={control_text_3_cl}>{acceleration_text}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const st_catalog = StyleSheet.create({
  catalog_cl: {
    height: '93%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  glob_subsc_button_cl: {
    width: '100%',
    backgroundColor: 'rgba(2, 122, 72, 1)',
    height: 47,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_1_cl: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(252, 252, 253, 1)',
    fontFamily: 'Roboto'
  },
  pattern_cl: {
    width: '100%',
    height: 26,
  },
  catalog_list_cl: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
  },
  gen_flast_cl: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  like_img_cl: {
    width: 40,
    height: 40,
  },
  fairy_tale_icon_cl: {
    width: 116,
    height: 116,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gen_main_block_cl: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  gen_block_info_cl: {
    width: '100%',
    paddingLeft: 32,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  gen_block_text_cl: {
    width: '65%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  gen_block_footer_cl: {
    width: '60%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gen_block_button_cl: {
    width: 118,
    height: 41,
    backgroundColor: 'rgba(3, 152, 85, 1)',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gen_button_text_cl: {
    color: 'rgba(252, 252, 253, 1)',
    fontSize: 16,
    fontFamily: 'Roboto',
  },


  work_block_cl: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    marginBottom: 15,
  },
  buttom_image_cl: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttom_block_cl: {
    position: 'relative',
    top: 16,
    left: 16,
    width: '91%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttom_image_1_2_cl: {
    width: 40,
    height: 40,
  },
  work_list_cl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 29,
  },
  work_list_child_cl: {
    width: '45%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  img_cl: {
    width: 24,
    height: 24,
  },
  work_scroll_cl: {
    overflow: 'scroll',
  },
  control_child_work_cl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  control_img_cl: {
    width: 24,
    height: 24,
  },
  control_main_button_cl: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(2, 122, 72, 1)',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  control_img_2_cl: {
    width: 52,
    height: 52,
  },
  control_child_work_2_cl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});