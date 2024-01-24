# Demo Uploader des fichiers avec React

Lien vers le répertoire gitHub :
https://github.dev/Niirok/demo-react-upload/blob/main/README.md

## Exercice

### Installation

1 - forkez ce dépôt

2 - clonez votre fork sur votre machine

3 - installez les dépendances `npm install`

4 - vérifiez que tout fonctionne correctement : `npm run dev`

### Étape 1 : Création du bouton pour déposer un fichier

Sur la page Contact, il y a un formulaire dans lequel nous allons ajouter une nouvelle entrée (une nouvelle balise <input>) entre le message et le boutton d'envoi.

```html
<input id="image" type="file" name="image" />
```

Une fois que c'est fait, vous devriez voir apparaitre un bouton d'ajout de fichier qui permet de choisir d'uploader un fichier depuis votre machine.

### Étape 2 : Utilisation et stockage du fichier

Pour pouvoir manipuler notre fichier, nous allons faire un état (state). Il faudra donc faire un apport de useState et ensuite créer notre variable

```js
import { useState } from 'react';

[...]

const [file, setFile] = useState<File | undefined>();
```

Nous pouvons ensuite mettre en place une nouvelle fonction que nous appellerons handleOnChange et que nous utiliserons pour écouter les modifications de notre champ de formulaire et enregistrer la valeur :

```js
function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
  const target = e.target as HTMLInputElement & {
    files: FileList;
  }

  setFile(target.files[0]);
}
```

Ici, nous utilisons e.target qui sera notre champ de formulaire à partir de l'événement de modification, puis nous lisons les fichiers associés, récupérons le premier fichier et l'utilisons pour définir notre fichier dans l'état.

Enfin, nous pouvons configurer notre champ de formulaire pour déclencher cette fonction lorsqu'il est modifié :

```jsx
<input id="image" type="file" name="image" onChange={handleOnChange} />
```

Pour tester cela, nous pouvons afficher dans la console le résultat de notre état de fichier sous l'instance useState et voir la mise à jour de notre fichier !

### Étape 3 : Téléchargement d'un fichier à partir d'un formulaire à l'aide de FormData vers Cloudinary

Nous pouvons utiliser Cloudinary, une plateforme d'images et de vidéos. Pour ce faire, nous utiliserons une requête non authentifiée vers leur API REST, en envoyant FormData avec le fichier.

Nous utiliserons le gestionnaire de soumission de notre formulaire, la fonction handleOnSubmit().

À l'intérieur, nous pouvons créer une nouvelle instance de FormData et commencer à remplir nos informations.

```javascript
if (typeof file === "undefined") return;

const formData = new FormData();

formData.append("file", file);
formData.append("upload_preset", "<Votre Upload Preset non signé>");
formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
```

Ensuite, nous créons une nouvelle instance de FormData, où nous ajoutons notre fichier et nos deux valeurs Cloudinary requises, un Upload Preset et la clé API de notre compte sous forme de variable d'environnement.

Ensuite, nous pouvons envoyer directement cette FormData vers Cloudinary :

```javascript
const results = await fetch(
  "https://api.cloudinary.com/v1_1/<Votre Nom de Cloud>/image/upload",
  {
    method: "POST",
    body: formData,
  }
).then((r) => r.json());
```

Remarque : Assurez-vous de remplacer <Votre Nom de Cloud> par votre nom de Cloudinary. Vous devrez certainement vous faire un compte

Nous passons notre FormData comme corps d'une requête POST vers le point de terminaison de téléchargement d'image et avec pouf, nous avons un fichier téléchargé !

## Étape 4 : Autoriser uniquement certains types de fichiers, comme les images, à être sélectionnés

Lors de l'ajout d'un sélecteur de fichiers, vous ne voudrez peut-être pas rendre TOUS les types de fichiers disponibles, nous allons limiter le téléchargement aux images.

L'élément input prend un attribut _accept_ où nous pouvons spécifier exactement les types de fichiers que nous voulons autoriser.

Mettez à jour la balise input comme suit :

```jsx
<input
  id="image"
  type="file"
  name="image"
  accept="image/png, image/jpg"
  onChange={handleOnChange}
/>
```

Cela n'autorise que certains types d'images, ou :

```jsx
<input
  id="image"
  type="file"
  name="image"
  accept="image/*"
  onChange={handleOnChange}
/>
```

Pour autoriser n'importe quel type d'image.

Et maintenant, lorsque nous ouvrons le sélecteur de fichiers, nous verrons que seuls les fichiers image peuvent être sélectionnés !

## Étape 5 : Affichage d'un aperçu d'une image lors de la sélection

Actuellement, lorsque quelqu'un sélectionne une image, il doit espérer avoir sélectionné la bonne par le nom. Essayons de faire s'afficher un aperçu de l'image.

Nous utiliserons l'API FileReader pour cela et enregistrerons une version d'aperçu via une URL de données qui nous permettra de mettre à jour une source d'image avec cette valeur.

Tout d'abord, créons une nouvelle instance de state où nous stockerons cet aperçu :

```jsx
  const [preview, setPreview] = (useState<string | ArrayBuffer | null>(null));
```

Nos valeurs potentielles sont une chaîne de caractères, un ArrayBuffer ou null (valeur par défaut), nous voulons donc nous assurer qu'elle est correctement typée.

Ensuite, mettons à jour la fonction handleOnChange pour lire notre fichier :

```jsx
function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
  const target = e.target as HTMLInputElement & {
    files: FileList;
  }

  setFile(target.files[0]);

  const file = new FileReader;

  file.onload = function() {
    setPreview(file.result);
  }

  file.readAsDataURL(target.files[0])
}
```

Et maintenant, ajoutons une nouvelle image en dessous de notre input de fichier qui ne s'affiche que lorsque cet aperçu est disponible :

```jsx
{preview && (
  <p><img src={preview as string} alt="Aperçu du téléchargement" /></p>
)}
```

Si nous chargeons maintenant notre application et sélectionnons un fichier, nous devrions voir notre image !

### Étape 6 : Ajout du glisser-déposer avec React Dropzone

Comment permettre à nos visiteurs de faire glisser une image depuis leur bureau ? Nous pouvons utiliser React Dropzone pour ajouter facilement la prise en charge du glisser-déposer à notre application React.

Tout d'abord, installez le package dans votre projet :

```bash
npm install react-dropzone
```

Ensuite, importez les dépendances dans votre page :

```jsx
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
```

Ici, nous importons également le useCallback de React que nous utiliserons comme recommandé pour envelopper nos fonctions de rappel pour Dropzone. Pour commencer à utiliser Dropzone, invoquez d'abord le hook useDropzone :

```jsx
const { getRootProps, getInputProps, isDragActive } = useDropzone();
```

Et ensuite, nous voulons remplacer notre input de fichier existant par l'interface utilisateur de React Dropzone :

```jsx
<div {...getRootProps()}>
  <input {...getInputProps()} />
  {isDragActive ? (
    <p>Déposez les fichiers ici...</p>
  ) : (
    <p>
      Faites glisser des fichiers ici, ou cliquez pour sélectionner des fichiers
    </p>
  )}
</div>
```

Nous pouvons voir que la manière dont fonctionne React Dropzone est qu'ils nous fournissent un objet de props que nous pouvons facilement utiliser dans l'interface utilisateur pour le configurer comme nécessaire.

Si nous ouvrons notre application, nous pouvons voir le texte, qui n'est pas très stylé, mais nous pouvons voir que si nous commençons à faire glisser un fichier, il se met à jour, ce qui signifie que cela fonctionne !

À ce stade, cela ne fait rien, nous ne pouvons même pas voir que le fichier a été sélectionné, mais nous pouvons utiliser un callback onDrop pour utiliser notre logique d'aperçu existante pour mettre à jour la page.

Tout d'abord, créons notre callback onDrop :

```jsx
const onDrop = useCallback((acceptedFiles: Array<File>) => {
  const file = new FileReader();

  file.onload = function () {
    setPreview(file.result);
  };

  file.readAsDataURL(acceptedFiles[0]);
}, []);
```

Dans notre fonction de rappel, nous obtenons acceptedFiles qui nous permet d'accéder au fichier sélectionné. Nous l'utilisons avec FileReader pour récupérer notre image et encore une fois définir notre aperçu.

Ensuite, nous devons transmettre cette fonction onDrop à useDropzone :

```jsx
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop
});
```

Et maintenant, lorsque nous faisons glisser notre fichier, nous pouvons le voir se mettre à jour avec un aperçu !

```ts
if ( typeof acceptedFiles[0] === 'undefined' ) return;

const formData = new FormData();

formData.append('file', acceptedFiles[0]);
formData.append('upload_preset', '<Your Upload Preset>');
formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
```

## Exercice Partie 2 : dockerisation et mise en prod automatique

Pour cette seconde partie, notre objectif sera de produire le dockerfile de notre application puis d'automatiser le déploiement de cette image docker sur render

### Création du fichier dockerfile et adaptation du fichier de configuration de vite

À la racine de votre projet, vous créerez un ficher Dockerfile que vous pourrez compléter en vous inspirant des fichers dockerfile déjà produits dont voici un exemple.

```md

FROM node:alpine

# Define the working directory, where the application will reside inside the Docker
WORKDIR /usr/src/app

# Copy package.json to the working directory
COPY package*.json .

#Run the npm install command to install the application dependencies on Docker
RUN npm install

# Copy the rest of the application files to Docker, i.e., app.js
COPY . .

EXPOSE 5173

CMD ["npm","run", "dev"]
```
Aussi, pour configurer correctement vite dans un environnement dockerisé, il faudra modifier le vite.config.ts en ajoutant les options suivantes

```ts
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  }
```

lisez <https://vitejs.dev/config/server-options> pour en apprendre plus sur les options serveurs

### Création d'un DockerHub pour y déposer votre image créée localement

Rappel : pour créer votre image à partir du Dockerfile :
```bash
docker build -t [nom_de_votre_image] . //à faire à la racine, là où se situe le Dockerfile
```

Vérifiez que tout fonctionne en lançant votre container avec l'image nouvellement construite

Ensuite trouvez un moyen de déposer cette image sur un dépôt nouveau DockerHub. Le push sur le dépot se fera manuellement dans le cadre de ce TP

### Création d'un projet render lié à un DockerHub

Faites vous un compte sur render et créer un nouveau projet "Web Service" et sélectionnez "Deploy an existing image from a registry" et dans le champs "Image URL
The image URL for your external image." Renseignez l'adresse de votre dépôt DockerHub et profitez de votre sité hébergé sur l'ordinateur de quelqu'un d'autre !

## Sources et aides

📝 Article: <https://kdta.io/b0WwW>

📺 YouTube: <https://www.youtube.com/watch?v=8uChP5ivQ1Q>

🚀 Demo: <https://my-react-file-upload.vercel.app/>

Dockerisation et configuration : 
<https://technotrampoline.com/articles/deploying-a-typescript-express-application-to-render/>
<https://plainenglish.io/blog/step-by-step-guide-to-dockerize-react-app-created-using-vite>
<https://devsday.ru/blog/details/131954>
