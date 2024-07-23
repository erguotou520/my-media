import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:provider/provider.dart';

import 'constants.dart';
import 'providers/user.dart';

import 'pages/landing.dart';
import 'pages/login.dart';
import 'pages/home.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (context) => UserState())],
      child: const MyApp(),
    ),
  );
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: APP_NAME,
      // locale: const Locale('zh', 'CH'),
      // supportedLocales: const [
      //   Locale('zh', 'CH'), // 中文语言环境
      // ],
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      // navigatorObservers: [
      //   FlutterSmartDialog.observer,
      // ],
      home: const _PrefetchPage(),
      // builder: (ctx, child) {
      //   return EasyLoading.init()(context, child);
      // },
    );
  }
}

class _PrefetchPage extends StatefulWidget {
  const _PrefetchPage({super.key});

  @override
  State<_PrefetchPage> createState() => _PrefetchPageState();
}

class _PrefetchPageState extends State<_PrefetchPage> {
  bool _ready = false;
  bool _logged = false;

  @override
  void initState() {
    super.initState();
    // 初始化数据
    Provider.of<UserState>(context, listen: false).init().then((tuple) {
      setState(() {
        _logged = tuple.item1;
        _ready = true;
      });
      return tuple;
    });
  }

  @override
  Widget build(BuildContext context) {
    return !_ready
        ? const LandingPage()
        : _logged
            ? const HomePage()
            : const LoginPage();
  }
}
