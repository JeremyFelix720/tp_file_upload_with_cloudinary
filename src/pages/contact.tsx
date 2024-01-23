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
