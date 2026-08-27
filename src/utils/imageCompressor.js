/**
 * Utilitaire de compression d'images avant sauvegarde
 * Réduit la résolution des photos trop grandes et applique une compression JPEG (0.75)
 * Empêche le dépassement du quota de stockage du navigateur (QuotaExceededError)
 */

/**
 * Compresse un fichier image sélectionné
 * @param {File} file - Fichier image brut
 * @param {number} maxWidth - Largeur max en pixels (par défaut 1200px)
 * @param {number} quality - Qualité de compression (0.75 par défaut)
 * @returns {Promise<string>} Data URL compressée (Base64 optimisé)
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error("Le fichier n'est pas une image valide."));
            return;
        }

        const reader = new FileReader();
        reader.onerror = (error) => reject(error);
        reader.onload = (event) => {
            const img = new Image();
            img.onerror = (error) => reject(error);
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Redimensionnement proportionnel si plus grand que maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Export en JPEG compressé
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
};

export default compressImage;
