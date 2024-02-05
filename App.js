import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedback} from 'react-native';
import { useEffect, useState } from 'react';
import _1_catalog from './components/_1_catalog.js';
import _2_catalog_media from './components/_2_catalog_media.js';
import _3_library from './components/_3_library.js';
import App_4_f from './components/_4_profile.js';
import * as SQLite from 'expo-sqlite';
import {screen_mode} from './components/_4_profile.js';

export let page_translation = 1; // регистратор переключения страниц;

export default function App() {
  //===================================================================================================//
  //                                       Глобальные переменные                                       //
  //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//

  // (переменная для работы с режимом приложения "светлый и темный");
  let [body_cl, set_body_cl] = useState({
    width: '100%',
    height: '92%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(252, 252, 253, 1)',
  });

  const [_1_catalog_style, set_1_catalog_style] = useState({display: ''}); // (блок вызова модуля "КАТАОЛОГ" (_1_catalog);
  const [_2_catalog_media_style, set_2_catalog_media_style] = useState({display: 'none'}); // (блок вызова модуля "КАТАОЛОГ-МЕДИА" (_2_catalog_media);
  const [_3_library_style, set_3_library_style] = useState({display: 'none'}); // (блок вызова модуля "БИБЛИОТЕКА" (_3_library);
  const [_4_profile_style, set_4_profile_style] = useState({display: 'none'}); // (блок вызова модуля "ПРОФИЛЬ" (_4_profile);

  let[_1_catalog_img, set_1_catalog_img] = useState(require('./components/_1_catalog_img_select.png')); // (изображение кнопки "КАТАОЛОГ";
  let[_2_catalog_media_img, set_2_catalog_media_img] = useState(require('./components/_2_catalog_media_img.png')); // (изображение кнопки "КАТАОЛОГ-МЕДИА";
  let[_3_library_img, set_3_library_img] = useState(require('./components/_3_library.png')); // (изображение кнопки "БИБЛИОТЕКА";
  let[_4_profile_img, set_4_profile_img] = useState(require('./components/_4_profile.png')); // (изображение кнопки "ПРОФИЛЬ";

  // локальная база данных для сохранения пользователя;
  const db = SQLite.openDatabase('mydb.db');
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS local_user (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, password TEXT, light_dark TEXT, translation TEXT);', [],
      (_, result) => { console.log('Table created successfully') },
      (_, error) => { console.error('Error creating table:', error) }
    );
  });
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM local_user;', [],
      (txObj, resultSet) => {
        const rows = resultSet.rows;
        const items = [];
        for (let i = 0; i < rows.length; i++) {
          items.push(rows.item(i));
        };
        if (items.length == 0) {
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO local_user (user, password, light_dark, translation) VALUES (?, ?, ?, ?);', ['none', 'none', 'light', 'ru'],
              (txObj, resultSet) => { console.log('Data inserted successfully') },
              (txObj, error) => { console.error(error) }
            );
          });
        }
      },
      (txObj, error) => { console.error(error); }
    );
  });

  //===================================================================================================//
  //                                            ФУНКЦИИ                                                //
  //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//

  // Функция перехода на страницу "КАТАЛОГ";
  function click_catalog_f() {
    set_1_catalog_style(prevStyle => ({ ...prevStyle, display: '' }));
    set_2_catalog_media_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_3_library_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_4_profile_style(prevStyle => ({ ...prevStyle, display: 'none' }));

    set_1_catalog_img(require('./components/_1_catalog_img_select.png'));
    set_2_catalog_media_img(require('./components/_2_catalog_media_img.png'));
    set_3_library_img(require('./components/_3_library.png'));
    set_4_profile_img(require('./components/_4_profile.png'));
  }

  // Функция перехода на страницу "КАТАОЛОГ-МЕДИА";
  function click_catalog_media_f() {
    set_1_catalog_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_2_catalog_media_style(prevStyle => ({ ...prevStyle, display: '' }));
    set_3_library_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_4_profile_style(prevStyle => ({ ...prevStyle, display: 'none' }));

    set_1_catalog_img(require('./components/_1_catalog_img.png'));
    set_2_catalog_media_img(require('./components/_2_catalog_media_img_select.png'));
    set_3_library_img(require('./components/_3_library.png'));
    set_4_profile_img(require('./components/_4_profile.png'));
  }

  // Функция перехода на страницу "БИБЛИОТЕКА";
  function click_library_f() {
    set_1_catalog_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_2_catalog_media_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_3_library_style(prevStyle => ({ ...prevStyle, display: '' }));
    set_4_profile_style(prevStyle => ({ ...prevStyle, display: 'none' }));

    set_1_catalog_img(require('./components/_1_catalog_img.png'));
    set_2_catalog_media_img(require('./components/_2_catalog_media_img.png'));
    set_3_library_img(require('./components/_3_library_select.png'));
    set_4_profile_img(require('./components/_4_profile.png'));
  }

  // Функция перехода на страницу "ПРОФИЛЬ";
  function click_profile_f() {
    set_1_catalog_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_2_catalog_media_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_3_library_style(prevStyle => ({ ...prevStyle, display: 'none' }));
    set_4_profile_style(prevStyle => ({ ...prevStyle, display: '' }));

    set_1_catalog_img(require('./components/_1_catalog_img.png'));
    set_2_catalog_media_img(require('./components/_2_catalog_media_img.png'));
    set_3_library_img(require('./components/_3_library.png'));
    set_4_profile_img(require('./components/_4_profile_select.png'));
  }

  //===============ФУНКЦИИ_ПЕРЕКЛЮЧЕНИЯ_ТЕМНОГО_И_СВЕТЛОГО_РЕЖИМОВ===============//
  let [footer_cl, set_footer_cl] = useState({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: 'rgba(234, 236, 240, 1)',
  });

  let [block_body_cl, set_block_body_cl] = useState({
    backgroundColor: 'rgba(252, 252, 253, 1)',
  })

  // Детонатор функции "switching_modes_1";
  let [x, set_x] = useState(screen_mode);
  function x_f () {
    set_x(screen_mode);
  };
  useState(()=>{
    setInterval(() => {x_f()}, 500);
  },[])

  // Функции изменение цвета при темном и светлом режимах;
  useEffect(() => {
    const switching_modes = () => {
      if (x === 'light') {
        set_footer_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(234, 236, 240, 1)' }));
        set_body_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
        set_block_body_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
      };
      if (x === 'dark') {
        set_footer_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(29, 41, 57, 1)' }));
        set_body_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
        set_block_body_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
      };
    }
    switching_modes();
  }, [x]);

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
            set_footer_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(234, 236, 240, 1)' }));
            set_body_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(252, 252, 253, 1)' }));
          }
          else {
            set_footer_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(29, 41, 57, 1)' }));
            set_body_cl(prevBG => ({ ...prevBG, backgroundColor: 'rgba(16, 24, 40, 1)' }));
          }
        });
    });
  }
  useEffect(()=>{
    switching_modes();
  },[]);

  return (
    <View style={body_cl}>
      <View style={{height: 50}}>{/*БУФЕР*/}</View>
      <View style={block_body_cl}>
        {/*===========================БЛОК_СТРАНИЦ_ПРИЛОЖЕНИЯ==============================*/}
        <View style={_1_catalog_style}>
          <_1_catalog />
        </View>
        <View style={_2_catalog_media_style}>
          <_2_catalog_media />
        </View>
        <View style={_3_library_style}>
          <_3_library />
        </View>
        <View style={_4_profile_style}>
          <App_4_f />
        </View>
        {/*===========================БЛОК_СТРАНИЦ_ПРИЛОЖЕНИЯ==============================*/}
      </View>
      <View style={footer_cl}>
        {/*===========================ПОДВАЛ_ПРИЛОЖЕНИЯ==============================*/}
        <TouchableWithoutFeedback onPress={()=>{click_catalog_f(); page_translation=1}}>
          <ImageBackground
            source={_1_catalog_img} resizeMode='cover'
            style={st_main.buttom_image_cl}>{/*_кнопка "КАТАЛОГ"_*/}</ImageBackground>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>{click_catalog_media_f(); page_translation=2}}>
          <ImageBackground
            source={_2_catalog_media_img} resizeMode='cover'
            style={st_main.buttom_image_cl}>{/*_кнопка "КАТАЛОГ (МЕДИАТЕКА)"_*/}</ImageBackground>
        </TouchableWithoutFeedback >
        <TouchableWithoutFeedback onPress={()=>{click_library_f(); page_translation=3}}>
          <ImageBackground
            source={_3_library_img} resizeMode='cover'
            style={st_main.buttom_image_3_cl}>{/*_кнопка "БИБЛИОТЕКА"_*/}</ImageBackground>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>{click_profile_f(); page_translation=4}}>
          <ImageBackground
            source={_4_profile_img} resizeMode='cover'
            style={st_main.buttom_image_4_cl}>{/*_кнопка "ПРОФИЛЬ"_*/}</ImageBackground>
        </TouchableWithoutFeedback>
        {/*===========================ПОДВАЛ_ПРИЛОЖЕНИЯ==============================*/}
      </View>
      <StatusBar style='auto' />
    </View>
  );
}

const st_main = StyleSheet.create({
  buttom_image_cl: {
    width: 45,
    height: 40,
  },
  buttom_image_3_cl: {
    width: 65,
    height: 40,
  },
  buttom_image_4_cl: {
    width: 50,
    height: 40,
  },
});