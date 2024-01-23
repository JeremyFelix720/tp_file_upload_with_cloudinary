import Layout from '@/components/Layout';
import Container from '@/components/Container';
import FormRow from '@/components/FormRow';
import FormLabel from '@/components/FormLabel';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import { useState, useCallback } from 'react';
import { useDropzone } from "react-dropzone";

function Contact() {

  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = (useState<string | ArrayBuffer | null>(null));

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }
  
    setFile(target.files[0]);

    // Prévisualisation de l'image à stocker sur Cloudinary
    const file = new FileReader;
    file.onload = function() {
      setPreview(file.result);
    }
    file.readAsDataURL(target.files[0])
  }
  
  console.log(file);


  // Gestion du "drag and drop"
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader();
  
    file.onload = function () {
      setPreview(file.result);
    };
  
    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });


  /**
   * handleOnSubmit
   */

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (typeof acceptedFiles[0] === 'undefined') return; // Si la condition est remplie, on sort de la fonction.

    const formData = new FormData();
    
    formData.append("file", acceptedFiles[0]);
    formData.append("upload_preset", "mugzlh6r"); // Mettre le nom de l'Upload preset (récupéré sur mon compte Cloudinary, dans Settings > Téléchargement) ; vérifier qu'il est "non signé", sinon en créer un autre ou modifier un existant.
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY); // Mettre le numéro de la Clé d'API (récupérée sur mon compte Cloudinary) dans le fichier .env (à la racine du projet).

    const results = await fetch(
      "https://api.cloudinary.com/v1_1/dw0msmoe5/image/upload", // copier-coller le nom d'utilisateur (affiché en bas à gauche du compte Cloudinary)
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());
  }

  return (
    <Layout>

      <Container>
        <h1 className="text-6xl font-black text-center text-slate-900 mb-20">
          Contact Us
        </h1>
        
        <form className="max-w-md border border-gray-200 rounded p-6 mx-auto" onSubmit={handleOnSubmit}>
          <FormRow className="mb-5">
            <FormLabel htmlFor="name">Name</FormLabel>
            <InputText id="name" name="name" type="text" />
          </FormRow>

          <FormRow className="mb-5">
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputText id="email" name="email" type="email" />
          </FormRow>
          
          <FormRow className="mb-5">
            <FormLabel htmlFor="message">Message</FormLabel>
            <InputText id="message" name="message" type="text" />
          </FormRow>

          <FormRow className="mb-5">
            <div className='drag_and_drop'>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Déposez les fichiers ici...</p>
                ) : (
                  <p>
                    Faites glisser des fichiers ici, ou cliquez pour sélectionner des fichiers.
                  </p>
                )}
              </div>
            </div>
            <div className='upload_preview'>
              {preview && (
                <p><img src={preview as string} alt="Aperçu du téléchargement" /></p>
              )}
            </div>
          </FormRow>

          <Button>Submit</Button>
        </form>

      </Container>
    </Layout>
  )
}

export default Contact;

/*
<FormLabel htmlFor="upload">Upload your file</FormLabel>
<input
  id="upload"
  type="file"
  name="upload"
  accept="image/*" // Seules les images sont acceptés.
  onChange={handleOnChange}
/>
*/