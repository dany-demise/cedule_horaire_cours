import { IndexedDBManager } from '$lib/domain/db/indexed-db-manager';
import type { DatabaseSchema } from '$lib/domain/db/db-schema';

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

    // Attributs
    idbManager = new IndexedDBManager();
    initDbManager = async () => { await this.idbManager.initialize(); }

    // Méthodes
    nouveauEtudiant(student: Omit<DatabaseSchema["students"]["value"], "id">) {
        console.log(student)
        this.idbManager.addStudent(
            student
        )
        console.log("ok");
    }

    async getAllEtudiants() {
        return await this.idbManager.getAllStudents();
    }

}
