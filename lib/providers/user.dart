import 'package:flutter/material.dart';
import 'package:tuple/tuple.dart';

import 'auth.dart';

typedef User = dynamic;

class UserState extends ChangeNotifier {
  User? _user;
  String _token = "";
  bool _initialized = false;

  User? get user => _user;
  bool get logged => _token != "" && _user != null;
  String get token => _token;
  bool get initialized => _initialized;

  Future<Tuple2<bool, User?>> init() async {
    var stored = await Authentication.init();
    _initialized = true;
    if (stored.item1.isNotEmpty && stored.item2 != null) {
      onLoginSuccess(stored.item1, stored.item2!);
    } else {
      notifyListeners();
    }
    return Tuple2(logged, user);
  }

  void onLoginSuccess(String token, User user) {
    _token = token;
    _user = user;
    Authentication.setToken(_token);
    Authentication.setUser(_user);
    notifyListeners();
  }

  logout() async {
    _token = "";
    _user = null;

    Authentication.clear();
    // client.logout(true);
    notifyListeners();
  }

  updateMe(User newUser) {
    _user = newUser;
    Authentication.setUser(newUser);
    notifyListeners();
  }

  Future refreshMe() async {
    try {
      var user = await Authentication.fetchUser();
      if (user != null) {
        updateMe(user);
      }
    } catch (e) {}
  }
}
