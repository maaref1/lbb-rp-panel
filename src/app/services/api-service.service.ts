import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import {BASE_URL, BASE_URL_SERVER_RP} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient){
  }

  postLogin(user, pass) {
    const params = {
      'username': user,
      'password': pass
    }

    const header = {
      'Content-Type' : 'application/json'
    }

    return this.http.post<ApiResponse>(BASE_URL + "lbb-panel/login", params, {headers: header})
  }

  getListUsers(token) {
    const header = {
      'Content-Type' : 'application/json',
      'token' : token
    }
    return this.http.post<ApiResponse>(BASE_URL + "pi/allUsers", null, {headers: header})
  }

  getSshForUsers(userId, token) {
    const params = {
        'userId': userId,
    }
              //.set('',"")
    const header = {
      'Content-Type' : 'application/json',
      'token' : token
    }
    return this.http.post<ApiResponse>(BASE_URL + "pi/get_ssh_info", params, {headers: header})
  }

  editUserToWS(u, p, token) {
    const params = {
        'username': u,
        'password': p,
    }

    const header = {
      'Content-Type' : 'application/json',
      'token' : token
    }
    return this.http.post<ApiResponse>(BASE_URL + "pi/edit-user-data", params, {headers: header})
  }

  addUserToWS(u, p, token) {
    const params = {
        'username': u,
        'password': p,
    }

    const header = {
      'Content-Type' : 'application/json',
      'token' : token
    }
    return this.http.post<ApiResponse>(BASE_URL + "pi/register-new-user", params, {headers: header})
  }

  addSshToWS(host, user, pass, port, userId,  token) {

    const params = {
        'userId' : userId,
        'ssh_host': host,
        'ssh_user': user,
        'ssh_pass': pass,
        'ssh_port': port,
    }

    const header = {
      'Content-Type' : 'application/json',
      'token' : token
    }
    return this.http.post<ApiResponse>(BASE_URL + "pi/add-ssh-user", params, {headers: header})
  }

  editSshToWS(host, user, pass, port, userId,  token) {

    const params = {
        'userId' : userId,
        'ssh_host': host,
        'ssh_user': user,
        'ssh_pass': pass,
        'ssh_port': port,
    }

    const header = {
      'Content-Type' : 'application/json',
      'token' : token
    }
    return this.http.post<ApiResponse>(BASE_URL + "pi/edit-ssh-user", params, {headers: header})
  }

  getListCollectionsByUser(userId, token) {
    const params = {
      'userId' : userId,
  }

  const header = {
    'Content-Type' : 'application/json',
    'token' : token
  }
  return this.http.post<ApiResponse>(BASE_URL + "pi/getListCollections", params, {headers: header})
  }

  /** LBB Panel **/

  addUserToWhitelist(username, isActive) {

    const params = {
      'username' : username,
      'isActive': isActive,
    }

    const header = {
      'Content-Type' : 'application/json',
    }
    return this.http.post<ApiResponse>(BASE_URL_SERVER_RP + "lbb-panel/addUserToWhitelistWhithStat", params, {headers: header})
  }

  getListUsersInwhitelist() {
    const params = {}

    const header = {
      'Content-Type' : 'application/json',
    }
    return this.http.get<ApiResponse>(BASE_URL_SERVER_RP + "lbb-panel/getListWhitelist", {headers: header})
  }

  setUserWhitelistStat(username, stat) {
    const isActive = stat ? 1 : 0;
    const params = {
      'username' : username,
      'isActive': isActive,
    };

    const header = {
      'Content-Type' : 'application/json',
    };

    return this.http.put<ApiResponse>(BASE_URL_SERVER_RP + "lbb-panel/setUserWhitelistStat", params, {headers: header})
  }
}



