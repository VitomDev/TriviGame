export class Perfil {
    usuari!: string
    nomfitxer!: string
    url!: string
    fitxer: File
// el constructor assignarà el fitxer que passem com a paràmetre al camp fitxer
    constructor(f: File) {
    this.fitxer = f;
    }
}