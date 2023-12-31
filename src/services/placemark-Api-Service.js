// @ts-nocheck
import axios from "axios";
import {latestPlacemark, user} from "../stores";

export const placemarkApiService = {
    //baseUrl: "http://localhost:4000",
    baseUrl: "https://placemark-christiankiel-kasd.onrender.com",

    async login(email, password) {
        try {
            const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
            axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
            if (response.data.success) {
                user.set({
                    email: email,
                    token: response.data.token
                });
                localStorage.placemarkUser = JSON.stringify({ email: email, token: response.data.token });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    },


    async logout() {
            user.set({
                email: "",
                token: "",
            });
            axios.defaults.headers.common["Authorization"] = "";

        localStorage.removeItem("placemarkUser");
    },

    async signup(firstName, lastName, email, password) {
        try {
            const userDetails = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            };
            await axios.post(this.baseUrl + "/api/users", userDetails);
            return true;
        } catch (error) {
            return false;
        }
    },

    reload() {
    const userCreds = localStorage.placemarkUser;
    if (userCreds) {
        const savedUser = JSON.parse(userCreds);
        user.set({
            email: savedUser.email,
            token: savedUser.token
        });
        axios.defaults.headers.common["Authorization"] = "Bearer " + savedUser.token;
    }
},
    async getAllUsers(){
        try {
            const response = await axios.get(this.baseUrl + "/api/users");
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async getUserByEmail(email){
        try {
            const response = await axios.get(this.baseUrl + "/api/users/email/" + email);
            return response.data;
        } catch (error) {
            return null;
        }
    },

    async getAllPlacemarks(){
        try {
            const response = await axios.get(this.baseUrl + "/api/placemarks");
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async createPlacemark(id, placemark,userid) {
        try {
            const res = await axios.post(`${this.baseUrl}/api/categories/${id}/placemarks`, placemark,userid);
            latestPlacemark.set(res.data);
            return res.data;
        }catch (error){
            return null;
        }

    },

    async getAllCategories(){
        try {
            const response = await axios.get(this.baseUrl + "/api/categories");
            return response.data;
        } catch (error) {
            return [];
        }
    },

    async getCategory(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/categories/" + id);
            return response.data;
        } catch (error) {
            return [];
        }
    },

};
