import React, { useState } from 'react';
import {
  useGetIdentity,
  useActiveAuthProvider,
} from "@refinedev/core";
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate } from 'react-router-dom';
import Form from '../components/common/Form';
import { FieldValues } from "react-hook-form";

export const CreateProperty = () => {
  const navigate = useNavigate();
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const [propertyImage, setPropertyImage] = useState( {name:'', url:''} );
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
} = useForm();

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
        new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.readAsDataURL(readFile);
        });

    reader(file).then((result: string) =>
        setPropertyImage({ name: file?.name, url: result }),
    );
};

const onFinishHandler = async (data: FieldValues) => {
  if (!propertyImage.name) return alert("Please select an image");

  try {
    const response = await fetch('https://refine-dashboard-3gx3.onrender.com/api/v1/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any additional headers if required
      },
      body: JSON.stringify({
        ...data,
        photo: propertyImage.url,
        email: user?.email,
      }),
    });
    if (response.ok) {
      // Handle success
      navigate('/allProperties');
    } else {
      // Handle error
      throw new Error('Failed to submit form data');
    }
  } catch (error) {
    // Handle error
    console.error('Error submitting form data:', error);
    alert('An error occurred while submitting form data');
  }
};

  return (
    <Form
      type='Create'
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  )
}
