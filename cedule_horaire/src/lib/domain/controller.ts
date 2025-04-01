import { GlobalStoreEnum } from "./global-store-functions";

export class Controller {
    // Singleton class attributes and methods
    private static _instance: Controller;
    private constructor() { }
    public static getInstance() {
        if (this._instance) { return this._instance; }
        else { this._instance = new this(); return this._instance; }
    }
    // Global store de fonctions
    globalStore: Map<string, Function> = new Map();
    callStoreFunc(funcName: string) {
        const func = this.globalStore.get(funcName);
        if (typeof func === "function") {
            func();
        }
    }

    nouveauEtudiant() {
        
    }

}
