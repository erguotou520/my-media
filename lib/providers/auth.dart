import 'package:flutter/material.dart';
import 'package:my_media/utils/store.dart';
import 'package:tuple/tuple.dart';

const STORED_TOKEN_KEY = "user.token";

typedef User = dynamic;

class Authentication {
  static User? _user;
  static String _token = "";
  static void setUser(User? user) {
    Authentication._user = user;
  }

  static User? getUser() => Authentication._user;

  static void setToken(String token, {bool save = true}) {
    Authentication._token = token;
    if (token.isEmpty) {
      // client.unsetAuthorization();
      if (save) {
        SharedPreferencesUtil.removeData(STORED_TOKEN_KEY);
      }
    } else {
      // client.setAuthorizationToken(token);
      if (save) {
        SharedPreferencesUtil.saveData<String>(STORED_TOKEN_KEY, _token);
      }
    }
  }

  static String getToken() => Authentication._token;

  static void clear() {
    Authentication.setToken("");
    Authentication.setUser(null);
  }

  static Future<User?> fetchUser() async {
    // User? me = await client.fetchUser();
    // var resp = await client.query<User__Me, User__MeResponseData>(User__Me());
    // if (!resp.error) {
    //   Authentication.setUser(resp.data!.data!);
    //   return resp.data!.data!;
    // }
    return null;
  }

  static Future<Tuple2<String, User?>> init() async {
    // 已有数据
    if (Authentication._token.isNotEmpty) {
      Authentication.setToken(Authentication._token, save: false);
      return Tuple2(Authentication._token, Authentication._user);
    }
    String token = '';
    try {
      token =
          await SharedPreferencesUtil.getData<String>(STORED_TOKEN_KEY) ?? '';
    } catch (e) {}
    debugPrint("token: $token");
    if (token.isNotEmpty) {
      Authentication.setToken(token, save: false);
      var me = await Authentication.fetchUser();
      // 切换环境时可能有 token 没 user
      // if (me?.id == null) {
      //   return const Tuple2("", null);
      // }
      return Tuple2(token, me);
    }
    return const Tuple2("", null);
  }
}
