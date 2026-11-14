---
title: Hexo中使用emoji表情
description: 为 Hexo 更换 markdown-it 渲染引擎并配置 emoji 插件，附 emoji 编码速查表。
date: 2020-06-21
tags:
  - Hexo
cover: /images/featureimages/15.jpg
---


Hexo 开启欢乐的 emoji 之旅 💛

Hexo 默认的 markdown 渲染引擎不支持将 Github emoji 渲染到静态的 html 页面中，我们换一个支持 emoji 的引擎，再增加一个 emoji 插件即可.

## 安装
命令行如下：

```bash
npm un hexo-renderer-marked --save
npm i hexo-renderer-markdown-it --save
npm install markdown-it-emoji --save
```

Tips：据说 hexo-renderer-markdown-it 的速度要比 Hexo 原装插件要快，而且功能更多

## 配置
完成插件安装后还需要修改 Hexo 站点配置文件 _config.yml（不是主题配置哦）

```bash
## markdown 渲染引擎配置，默认是hexo-renderer-marked，这个插件渲染速度更快，且有新特性
markdown:
  render:
    html: true
    xhtmlOut: false
    breaks: true
    linkify: true
    typographer: true
    quotes: '“”‘’'
  plugins:
    - markdown-it-footnote
    - markdown-it-sup
    - markdown-it-sub
    - markdown-it-abbr
    - markdown-it-emoji
  anchors:
    level: 2
    collisionSuffix: 'v'
    permalink: true
    permalinkClass: header-anchor
    permalinkSymbol: ¶
```

这里需要注意 render: 下的 html: 配置项，它的作用是控制 Markdown 渲染引擎是否转义文档中出现的 html 标签，默认为 false ，这里要设置为 true，否则回导致 `<a id="more"></a>` 渲染失败。

html: true # 不转义 HTML 内容，即允许 HTML  
\#\# OR  
html: false # 转义 HTML，< > 尖括号会被转义成 < >等  
plugins: 中的最后一项 - markdown-it-emoji 是手动添加的，官方 Github Wiki 中给出的配置不包含这一项，其他配置参照的 Github Wiki 中的默认配置，hexo-renderer-markdown-it 提供的其他新特性还没有一一尝试，暂时只想用它的 emoji 功能。✌️

## 使用方法
输入对应的emoji编码就行了  
例如：输入笑脸对应的 emoji 编码 `:smile:` 就可以得到 😄

## emoji编码合集
### People
😐 `:neutral_face:`	😄 `:smile:`	😆 `:laughing:`  
😊 `:blush:`	😃 `:smiley:`	☺️ `:relaxed:`  
😏 `:smirk:`	😍 `:heart_eyes:`	😘 `:kissing_heart:`  
😚 `:kissing_closed_eyes:`	😳 `:flushed:`	😌 `:relieved:`  
😆 `:satisfied:`	😁 `:grin:`	😉 `:wink:`  
😜 `:stuck_out_tongue_winking_eye:`	😝 `:stuck_out_tongue_closed_eyes:`	😀 `:grinning:`  
😗 `:kissing:`	😙 `:kissing_smiling_eyes:`	😛 `:stuck_out_tongue:`  
😴 `:sleeping:`	😟 `:worried:`	😦 `:frowning:`  
😧 `:anguished:`	😮 `:open_mouth:`	😬 `:grimacing:`  
😕 `:confused:`	😯 `:hushed:`	😑 `:expressionless:`  
😒 `:unamused:`	😅 `:sweat_smile:`	😓 `:sweat:`  
😥 `:disappointed_relieved:`	😩 `:weary:`	😔 `:pensive:`  
😞 `:disappointed:`	😖 `:confounded:`	😨 `:fearful:`  
😰 `:cold_sweat:`	😣 `:persevere:`	😢 `:cry:`  
😭 `:sob:`	😂 `:joy:`	😲 `:astonished:`  
😱 `:scream:`	💭 `:thought_balloon:`	😫 `:tired_face:`  
😠 `:angry:`	😡 `:rage:`	😤 `:triumph:`  
😪 `:sleepy:`	😋 `:yum:`	😷 `:mask:`  
😎 `:sunglasses:`	😵 `:dizzy_face:`	👿 `:imp:`  
😈 `:smiling_imp:`	💬 `:speech_balloon:`	😶 `:no_mouth:`  
😇 `:innocent:`	👽 `:alien:`	💛 `:yellow_heart:`  
💙 `:blue_heart:`	💜 `:purple_heart:`	❤️ `:heart:`  
💚 `:green_heart:`	💔 `:broken_heart:`	💓 `:heartbeat:`  
💗 `:heartpulse:`	💕 `:two_hearts:`	💞 `:revolving_hearts:`  
💘 `:cupid:`	💖 `:sparkling_heart:`	✨ `✨`  
⭐️ `:star:`	🌟 `:star2:`	💫 `:dizzy:`  
💥 `:boom:`	💥 `:collision:`	💢 `:anger:`  
❗️ `:exclamation:`	❓ `:question:`	❕ `:grey_exclamation:`  
❔ `:grey_question:`	💤 `:zzz:`	💨 `:dash:`  
💦 `:sweat_drops:`	🎶 `:notes:`	🎵 `:musical_note:`  
🔥 `:fire:`	💩 `:hankey:`	💩 `:poop:`  
💩 `:shit:`	👍 `:+1:`	👍 `:thumbsup:`  
👎 `:-1:`	👎 `:thumbsdown:`	👌 `:ok_hand:`  
👊 `:punch:`	👊 `:facepunch:`	✊ `:fist:`  
✌️ `:v:`	👋 `:wave:`	✋ `:hand:`  
✋ `:raised_hand:`	👐 `:open_hands:`	☝️ `:point_up:`  
👇 `:point_down:`	👈 `:point_left:`	👉 `:point_right:`  
🙌 `:raised_hands:`	🙏 `:pray:`	👆 `:point_up_2:`  
👏 `:clap:`	💪 `:muscle:`	🤘 `:metal:`  
🖕 `:fu:`	🚶 `:walking:`	🏃 `:runner:`  
🏃 `:running:`	👫 `:couple:`	👪 `:family:`  
👬 `:two_men_holding_hands:`	👭 `:two_women_holding_hands:`	💃 `:dancer:`  
👯 `:dancers:`	🙆 `:ok_woman:`	🙅 `:no_good:`  
💁 `:information_desk_person:`	🙋 `:raising_hand:`	👰 `:bride_with_veil:`  
🙎 `:person_with_pouting_face:`	🙍 `:person_frowning:`	🙇 `:bow:`  
:couplekiss: `:couplekiss:`	💑 `:couple_with_heart:`	💆 `:massage:`  
💇 `:haircut:`	💅 `:nail_care:`	👦 `:boy:`  
👧 `:girl:`	👩 `:woman:`	👨 `:man:`  
👶 `:baby:`	👵 `:older_woman:`	👴 `:older_man:`  
👱 `:person_with_blond_hair:`	👲 `:man_with_gua_pi_mao:`	👳 `:man_with_turban:`  
👷 `:construction_worker:`	👮 `:cop:`	👼 `:angel:`  
👸 `:princess:`	😺 `:smiley_cat:`	😸 `:smile_cat:`  
😻 `:heart_eyes_cat:`	😽 `:kissing_cat:`	😼 `:smirk_cat:`  
🙀 `:scream_cat:`	😿 `:crying_cat_face:`	😹 `:joy_cat:`  
😾 `:pouting_cat:`	👹 `:japanese_ogre:`	👺 `:japanese_goblin:`  
🙈 `:see_no_evil:`	🙉 `:hear_no_evil:`	🙊 `:speak_no_evil:`  
💂 `:guardsman:`	💀 `:skull:`	🐾 `:feet:`  
👄 `:lips:`	💋 `:kiss:`	💧 `:droplet:`  
👂 `:ear:`	👀 `:eyes:`	👃 `:nose:`  
👅 `:tongue:`	💌 `:love_letter:`	👤 `:bust_in_silhouette:`  
👥 `:busts_in_silhouette:`

### Nature
☀️ `:sunny:`	☔️ `:umbrella:`	☁️ `:cloud:`  
❄️ `:snowflake:`	⛄️ `:snowman:`	⚡️ `:zap:`  
🌀 `:cyclone:`	🌁 `:foggy:`	🌊 `:ocean:`  
🐱 `:cat:`	🐶 `:dog:`	🐭 `:mouse:`  
🐹 `:hamster:`	🐰 `:rabbit:`	🐺 `:wolf:`  
🐸 `:frog:`	🐯 `:tiger:`	🐨 `:koala:`  
🐻 `:bear:`	🐷 `:pig:`	🐽 `:pig_nose:`  
🐮 `:cow:`	🐗 `:boar:`	🐵 `:monkey_face:`  
🐒 `:monkey:`	🐴 `:horse:`	🐎 `:racehorse:`  
🐫 `:camel:`	🐑 `:sheep:`	🐘 `:elephant:`  
🐼 `:panda_face:`	🐍 `:snake:`	🐦 `:bird:`  
🐤 `:baby_chick:`	🐥 `:hatched_chick:`	🐣 `:hatching_chick:`  
🐔 `:chicken:`	🐧 `:penguin:`	🐢 `:turtle:`  
🐛 `:bug:`	🐝 `:honeybee:`	🐜 `:ant:`  
🐞 `:beetle:`	🐌 `:snail:`	🐙 `:octopus:`  
🐠 `:tropical_fish:`	🐟 `:fish:`	🐳 `:whale:`  
🐋 `:whale2:`	🐬 `:dolphin:`	🐄 `:cow2:`  
🐏 `:ram:`	🐀 `:rat:`	🐃 `:water_buffalo:`  
🐅 `:tiger2:`	🐇 `:rabbit2:`	🐉 `:dragon:`  
🐐 `:goat:`	🐓 `:rooster:`	🐕 `:dog2:`  
🐖 `:pig2:`	🐁 `:mouse2:`	🐂 `:ox:`  
🐲 `:dragon_face:`	🐡 `:blowfish:`	🐊 `:crocodile:`  
🐪 `:dromedary_camel:`	🐆 `:leopard:`	🐈 `:cat2:`  
🐩 `:poodle:`	🐾 `:paw_prints:`	💐 `:bouquet:`  
🌸 `:cherry_blossom:`	🌷 `:tulip:`	🍀 `:four_leaf_clover:`  
🌹 `:rose:`	🌻 `:sunflower:`	🌺 `:hibiscus:`  
🍁 `:maple_leaf:`	🍃 `:leaves:`	🍂 `:fallen_leaf:`  
🌿 `:herb:`	🍄 `:mushroom:`	🌵 `:cactus:`  
🌴 `:palm_tree:`	🌲 `:evergreen_tree:`	🌳 `:deciduous_tree:`  
🌰 `:chestnut:`	🌱 `:seedling:`	🌼 `:blossom:`  
🌾 `:ear_of_rice:`	🐚 `:shell:`	🌐 `:globe_with_meridians:`  
🌞 `:sun_with_face:`	🌝 `:full_moon_with_face:`	🌚 `:new_moon_with_face:`  
🌑 `:new_moon:`	🌒 `:waxing_crescent_moon:`	🌓 `:first_quarter_moon:`  
🌔 `:waxing_gibbous_moon:`	🌕 `:full_moon:`	🌖 `:waning_gibbous_moon:`  
🌗 `:last_quarter_moon:`	🌘 `:waning_crescent_moon:`	🌜 `:last_quarter_moon_with_face:`  
🌛 `:first_quarter_moon_with_face:`	🌔 `:moon:`	🌍 `:earth_africa:`  
🌎 `:earth_americas:`	🌏 `:earth_asia:`	🌋 `:volcano:`  
🌌 `:milky_way:`	⛅️ `:partly_sunny:`

### Objects
🎍 `:bamboo:`	💝 `:gift_heart:`	🎎 `:dolls:`  
🎒 `:school_satchel:`	🎓 `:mortar_board:`	🎏 `:flags:`  
🎆 `:fireworks:`	🎇 `:sparkler:`	🎐 `:wind_chime:`  
🎑 `:rice_scene:`	🎃 `:jack_o_lantern:`	👻 `:ghost:`  
🎅 `:santa:`	🎄 `:christmas_tree:`	🎁 `:gift:`  
🔔 `:bell:`	🔕 `:no_bell:`	🎋 `:tanabata_tree:`  
🎉 `:tada:`	🎊 `:confetti_ball:`	🎈 `:balloon:`  
🔮 `:crystal_ball:`	💿 `:cd:`	📀 `:dvd:`  
💾 `:floppy_disk:`	📷 `:camera:`	📹 `:video_camera:`  
🎥 `:movie_camera:`	💻 `:computer:`	📺 `:tv:`  
📱 `:iphone:`	☎️ `:phone:`	☎️ `:telephone:`  
📞 `:telephone_receiver:`	📟 `:pager:`	📠 `:fax:`  
💽 `:minidisc:`	📼 `:vhs:`	🔉 `:sound:`  
🔈 `:speaker:`	🔇 `:mute:`	📢 `:loudspeaker:`  
📣 `:mega:`	⌛️ `:hourglass:`	⏳ `:hourglass_flowing_sand:`  
⏰ `:alarm_clock:`	⌚️ `:watch:`	📻 `:radio:`  
📡 `:satellite:`	➿ `:loop:`	🔍 `:mag:`  
🔎 `:mag_right:`	🔓 `:unlock:`	🔒 `:lock:`  
🔏 `:lock_with_ink_pen:`	🔐 `:closed_lock_with_key:`	🔑 `:key:`  
💡 `:bulb:`	🔦 `:flashlight:`	🔆 `:high_brightness:`  
🔅 `:low_brightness:`	🔌 `:electric_plug:`	🔋 `:battery:`  
📲 `:calling:`	✉️ `:email:`	📫 `:mailbox:`  
📮 `:postbox:`	🛀 `:bath:`	🛁 `:bathtub:`  
🚿 `:shower:`	🚽 `:toilet:`	🔧 `:wrench:`  
🔩 `:nut_and_bolt:`	🔨 `:hammer:`	💺 `:seat:`  
💰 `:moneybag:`	💴 `:yen:`	💵 `:dollar:`  
💷 `:pound:`	💶 `:euro:`	💳 `:credit_card:`  
💸 `:money_with_wings:`	📧 `:e-mail`:	📥 `:inbox_tray:`  
📤 `:outbox_tray:`	✉️ `:envelope:`	📨 `:incoming_envelope:`  
📯 `:postal_horn:`	📪 `:mailbox_closed:`	📬 `:mailbox_with_mail:`  
📭 `:mailbox_with_no_mail:`	🚪 `:door:`	🚬 `:smoking:`  
💣 `:bomb:`	🔫 `:gun:`	🔪 `:hocho:`  
💊 `:pill:`	💉 `:syringe:`	📄 `:page_facing_up:`  
📃 `:page_with_curl:`	📑 `:bookmark_tabs:`	📊 `:bar_chart:`  
📈 `:chart_with_upwards_trend:`	📉 `:chart_with_downwards_trend:`	📜 `:scroll:`  
📋 `:clipboard:`	📆 `:calendar:`	📅 `:date:`  
📇 `:card_index:`	📁 `:file_folder:`	📂 `:open_file_folder:`  
✂️ `:scissors:`	📌 `:pushpin:`	📎 `:paperclip:`  
✒️ `:black_nib:`	✏️ `:pencil2:`	📏 `:straight_ruler:`  
📐 `:triangular_ruler:`	📕 `:closed_book:`	📗 `:green_book:`  
📘 `:blue_book:`	📙 `:orange_book:`	📓 `:notebook:`  
📔 `:notebook_with_decorative_cover:`	📒 `:ledger:`	📚 `:books:`  
🔖 `:bookmark:`	📛 `:name_badge:`	🔬 `:microscope:`  
🔭 `:telescope:`	📰 `:newspaper:`	🏈 `:football:`  
🏀 `:basketball:`	⚽️ `:soccer:`	⚾️ `:baseball:`  
🎾 `:tennis:`	🎱 `:8ball:`	🏉 `:rugby_football:`  
🎳 `:bowling:`	⛳️ `:golf:`	🚵 `:mountain_bicyclist:`  
🚴 `:bicyclist:`	🏇 `:horse_racing:`	🏂 `:snowboarder:`  
🏊 `:swimmer:`	🏄 `:surfer:`	🎿 `:ski:`  
♠️ `:spades:`	♥️ `:hearts:`	♣️ `:clubs:`  
♦️ `:diamonds:`	💎 `:gem:`	💍 `:ring:`  
🏆 `:trophy:`	🎼 `:musical_score:`	🎹 `:musical_keyboard:`  
🎻 `:violin:`	👾 `:space_invader:`	🎮 `:video_game:`  
🃏 `:black_joker:`	🎴 `:flower_playing_cards:`	🎲 `:game_die:`  
🎯 `:dart:`	🀄️ `:mahjong:`	🎬 `:clapper:`  
📝 `:memo:`	📝 `:pencil:`	📖 `:book:`  
🎨 `:art:`	🎤 `:microphone:`	🎧 `:headphones:`  
🎺 `:trumpet:`	🎷 `:saxophone:`	🎸 `:guitar:`  
👞 `:shoe:`	👡 `:sandal:`	👠 `:high_heel:`  
💄 `:lipstick:`	👢 `:boot:`	👕 `:shirt:`  
👕 `:tshirt:`	👔 `:necktie:`	👚 `:womans_clothes:`  
👗 `:dress:`	🎽 `:running_shirt_with_sash:`	👖 `:jeans:`  
👘 `:kimono:`	👙 `:bikini:`	🎀 `:ribbon:`  
🎩 `:tophat:`	👑 `:crown:`	👒 `:womans_hat:`  
👞 `:mans_shoe:`	🌂 `:closed_umbrella:`	💼 `:briefcase:`  
👜 `:handbag:`	👝 `:pouch:`	👛 `:purse:`  
👓 `:eyeglasses:`	🎣 `:fishing_pole_and_fish:`	☕️ `:coffee:`  
🍵 `:tea:`	🍶 `:sake:`	🍼 `:baby_bottle:`  
🍺 `:beer:`	🍻 `:beers:`	🍸 `:cocktail:`  
🍹 `:tropical_drink:`	🍷 `:wine_glass:`	🍴 `:fork_and_knife:`  
🍕 `:pizza:`	🍔 `:hamburger:`	🍟 `:fries:`  
🍗 `:poultry_leg:`	🍖 `:meat_on_bone:`	🍝 `:spaghetti:`  
🍛 `:curry:`	🍤 `:fried_shrimp:`	🍱 `:bento:`  
🍣 `:sushi:`	🍥 `:fish_cake:`	🍙 `:rice_ball:`  
🍘 `:rice_cracker:`	🍚 `:rice:`	🍜 `:ramen:`  
🍲 `:stew:`	🍢 `:oden:`	🍡 `:dango:`  
🥚 `:egg:`	🍞 `:bread:`	🍩 `:doughnut:`  
🍮 `:custard:`	🍦 `:icecream:`	🍨 `:ice_cream:`  
🍧 `:shaved_ice:`	🎂 `:birthday:`	🍰 `:cake:`  
🍪 `:cookie:`	🍫 `:chocolate_bar:`	🍬 `:candy:`  
🍭 `:lollipop:`	🍯 `:honey_pot:`	🍎 `:apple:`  
🍏 `:green_apple:`	🍊 `:tangerine:`	🍋 `:lemon:`  
🍒 `:cherries:`	🍇 `:grapes:`	🍉 `:watermelon:`  
🍓 `:strawberry:`	🍑 `:peach:`	🍈 `:melon:`  
🍌 `:banana:`	🍐 `:pear:`	🍍 `:pineapple:`  
🍠 `:sweet_potato:`	🍆 `:eggplant:`	🍅 `:tomato:`  
🌽 `:corn:`

### Places
🏠 `:house:`	🏡 `:house_with_garden:`	🏫 `:school:`  
🏢 `:office:`	🏣 `:post_office:`	🏥 `:hospital:`  
🏦 `:bank:`	🏪 `:convenience_store:`	🏩 `:love_hotel:`  
🏨 `:hotel:`	💒 `:wedding:`	⛪️ `:church:`  
🏬 `:department_store:`	🏤 `:european_post_office:`	🌇 `:city_sunrise:`  
🌆 `:city_sunset:`	🏯 `:japanese_castle:`	🏰 `:european_castle:`  
⛺️ `:tent:`	🏭 `:factory:`	🗼 `:tokyo_tower:`  
🗾 `:japan:`	🗻 `:mount_fuji:`	🌄 `:sunrise_over_mountains:`  
🌅 `:sunrise:`	🌠 `:stars:`	🗽 `:statue_of_liberty:`  
🌉 `:bridge_at_night:`	🎠 `:carousel_horse:`	🌈 `:rainbow:`  
🎡 `:ferris_wheel:`	⛲️ `:fountain:`	🎢 `:roller_coaster:`  
🚢 `:ship:`	🚤 `:speedboat:`	⛵️ `:boat:`  
⛵️ `:sailboat:`	🚣 `:rowboat:`	⚓️ `:anchor:`  
🚀 `:rocket:`	✈️ `:airplane:`	🚁 `:helicopter:`  
🚂 `:steam_locomotive:`	🚊 `:tram:`	🚞 `:mountain_railway:`  
🚲 `:bike:`	🚡 `:aerial_tramway:`	🚟 `:suspension_railway:`  
🚠 `:mountain_cableway:`	🚜 `:tractor:`	🚙 `:blue_car:`  
🚘 `:oncoming_automobile:`	🚗 `:car:`	🚗 `:red_car:`  
🚕 `:taxi:`	🚖 `:oncoming_taxi:`	🚛 `:articulated_lorry:`  
🚌 `:bus:`	🚍 `:oncoming_bus:`	🚨 `:rotating_light:`  
🚓 `:police_car:`	🚔 `:oncoming_police_car:`	🚒 `:fire_engine:`  
🚑 `:ambulance:`	🚐 `:minibus:`	🚚 `:truck:`  
🚋 `:train:`	🚉 `:station:`	🚆 `:train2:`  
🚅 `:bullettrain_front:`	🚄 `:bullettrain_side:`	🚈 `:light_rail:`  
🚝 `:monorail:`	🚃 `:railway_car:`	🚎 `:trolleybus:`  
🎫 `:ticket:`	⛽️ `:fuelpump:`	🚦 `:vertical_traffic_light:`  
🚥 `:traffic_light:`	⚠️ `:warning:`	🚧 `:construction:`  
🔰 `:beginner:`	🏧 `:atm:`	🎰 `:slot_machine:`  
🚏 `:busstop:`	💈 `:barber:`	♨️ `:hotsprings:`  
🏁 `:checkered_flag:`	🎌 `:crossed_flags:`	🏮 `:izakaya_lantern:`  
🗿 `:moyai:`	🎪 `:circus_tent:`	🎭 `:performing_arts:`  
📍 `:round_pushpin:`	🚩 `:triangular_flag_on_post:`

### Symbols
1️⃣ `:one:`	2️⃣ `:two:`	3️⃣ `:three:`  
4️⃣ `:four:`	5️⃣ `:five:`	6️⃣ `:six:`  
7️⃣ `:seven:`	8️⃣ `:eight:`	9️⃣ `:nine:`  
🔟 `:keycap_ten:`	🔢 `:1234:`	0️⃣ `:zero:`  
#️⃣ `:hash:`	🔣 `:symbols:`	◀️ `:arrow_backward:`  
⬇️ `:arrow_down:`	▶️ `:arrow_forward:`	⬅️ `:arrow_left:`  
🔠 `:capital_abcd:`	🔡 `:abcd:`	🔤 `:abc:`  
↙️ `:arrow_lower_left:`	↘️ `:arrow_lower_right:`	➡️ `:arrow_right:`  
⬆️ `:arrow_up:`	↖️ `:arrow_upper_left:`	↗️ `:arrow_upper_right:`  
⏬ `:arrow_double_down:`	⏫ `:arrow_double_up:`	🔽 `:arrow_down_small:`  
⤵️ `:arrow_heading_down:`	⤴️ `:arrow_heading_up:`	↩️ `:leftwards_arrow_with_hook:`  
↪️ `:arrow_right_hook:`	↔️ `:left_right_arrow:`	↕️ `:arrow_up_down:`  
🔼 `:arrow_up_small:`	🔃 `:arrows_clockwise:`	🔄 `:arrows_counterclockwise:`  
⏪ `:rewind:`	⏩ `:fast_forward:`	ℹ️ `:information_source:`  
🆗 `:ok:`	🔀 `:twisted_rightwards_arrows:`	🔁 `:repeat:`  
🔂 `:repeat_one:`	🆕 `:new:`	🔝 `:top:`  
🆙 `:up:`	🆒 `:cool:`	🆓 `:free:`  
🆖 `:ng:`	🎦 `:cinema:`	🈁 `:koko:`  
📶 `:signal_strength:`		  
🈂️ `:sa:`	🚻 `:restroom:`	🚹 `:mens:`  
🚺 `:womens:`	🚼 `:baby_symbol:`	🚭 `:no_smoking:`  
🅿️ `:parking:`	♿️ `:wheelchair:`	🚇 `:metro:`  
🛄 `:baggage_claim:`	🉑 `:accept:`	🚾 `:wc:`  
🚰 `:potable_water:`	🚮 `:put_litter_in_its_place:`	㊙️ `:secret:`  
㊗️ `:congratulations:`	Ⓜ️ `:m:`	🛂 `:passport_control:`  
🛅 `:left_luggage:`	🛃 `:customs:`	🉐 `:ideograph_advantage:`  
🆑 `:cl:`	🆘 `:sos:`	🆔 `:id:`  
🚫 `:no_entry_sign:`	🔞 `:underage:`	📵 `:no_mobile_phones:`  
🚯 `:do_not_litter:`	🚱 `:non-potable_water`:	🚳 `:no_bicycles:`  
🚷 `:no_pedestrians:`	🚸 `:children_crossing:`	⛔️ `:no_entry:`  
✳️ `:eight_spoked_asterisk:`	✴️ `:eight_pointed_black_star:`	💟 `:heart_decoration:`  
🆚 `:vs:`	📳 `:vibration_mode:`	📴 `:mobile_phone_off:`  
💹 `:chart:`	💱 `:currency_exchange:`	♈️ `:aries:`  
♉️ `:taurus:`	♊️ `:gemini:`	♋️ `:cancer:`  
♌️ `:leo:`	♍️ `:virgo:`	♎️ `:libra:`  
♏️ `:scorpius:`	♐️ `:sagittarius:`	♑️ `:capricorn:`  
♒️ `:aquarius:`	♓️ `:pisces:`	⛎ `:ophiuchus:`  
🔯 `:six_pointed_star:`	❎ `:negative_squared_cross_mark:`	🅰️ `:a:`  
🅱️ `:b:`	🆎 `:ab:`	🅾️ `:o2:`  
💠 `:diamond_shape_with_a_dot_inside:`	♻️ `:recycle:`	🔚 `:end:`  
🔛 `:on:`	🔜 `:soon:`	🕐 `:clock1:`  
🕜 `:clock130:`	🕙 `:clock10:`	🕥 `:clock1030:`  
🕚 `:clock11:`	🕦 `:clock1130:`	🕛 `:clock12:`  
🕧 `:clock1230:`	🕑 `:clock2:`	🕝 `:clock230:`  
🕒 `:clock3:`	🕞 `:clock330:`	🕓 `:clock4:`  
🕟 `:clock430:`	🕔 `:clock5:`	🕠 `:clock530:`  
🕕 `:clock6:`	🕡 `:clock630:`	🕖 `:clock7:`  
🕢 `:clock730:`	🕗 `:clock8:`	🕣 `:clock830:`  
🕘 `:clock9:`	🕤 `:clock930:`	💲 `:heavy_dollar_sign:`  
©️ `:copyright:`	®️ `:registered:`	™️ `:tm:`  
❌ `:x:`	❗️ `:heavy_exclamation_mark:`	‼️ `:bangbang:`  
⁉️ `:interrobang:`	⭕️ `:o:`	✖️ `:heavy_multiplication_x:`  
➕ `:heavy_plus_sign:`	➖ `:heavy_minus_sign:`	➗ `:heavy_division_sign:`  
💮 `:white_flower:`	💯 `:100:`	✔️ `:heavy_check_mark:`  
☑️ `:ballot_box_with_check:`	🔘 `:radio_button:`	🔗 `:link:`  
➰ `:curly_loop:`	〰️ `:wavy_dash:`	〽️ `:part_alternation_mark:`  
🔱 `:trident:`	🔻 `:small_red_triangle_down:`	🔺 `:small_red_triangle:`  
✅ `:white_check_mark:`	🔲 `:black_square_button:`	🔳 `:white_square_button:`  
⚫️ `:black_circle:`	⚪️ `:white_circle:`	🔴 `:red_circle:`  
🔵 `:large_blue_circle:`	🔷 `:large_blue_diamond:`	🔶 `:large_orange_diamond:`  
🔹 `:small_blue_diamond:`	🔸 `:small_orange_diamond:`

转载自：  
作者： John Xu  
链接： [https://hasaik.com/posts/9b280ea3.html](https://hasaik.com/posts/9b280ea3.html)
