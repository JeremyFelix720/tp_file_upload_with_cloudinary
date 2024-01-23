import Layout from '@/components/Layout';
import Container from '@/components/Container';
import FormRow from '@/components/FormRow';
import FormLabel from '@/components/FormLabel';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import { useState } from 'react';


function Contact() {

  const [file, setFile] = useState<File | undefined>();

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }
  
    setFile(target.files[0]);
  }
  
  console.log(file)


  /**
   * handleOnSubmit
   */

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();


    if (typeof file === "undefined") return; // Si la condition est remplie, on sort de la fonction.

    const formData = new FormData();
    
    formData.append("file", file);
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
            <FormLabel htmlFor="upload">Upload your file</FormLabel>
            <input id="upload" type="file" name="upload" onChange={handleOnChange} />
          </FormRow>

          <Button>Submit</Button>
        </form>

      </Container>
    </Layout>
  )
}

export default Contact;