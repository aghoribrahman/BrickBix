import React, { useState } from 'react';
import {
  useGetIdentity,
  useActiveAuthProvider,
} from "@refinedev/core";
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate } from 'react-router-dom';
import Form from '../components/common/Form';
import { FieldValues } from "react-hook-form";
import { useParams } from 'react-router-dom';

export const CreateProperty = () => {
  const navigate = useNavigate();
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { id } = useParams();
  const [propertyImage, setPropertyImage] = useState( {name:'', url:''} );
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
} = useForm({
  refineCoreProps: {
      action: "create",
      resource: "properties",
      id: id,
  },
});

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

  await onFinish({
      ...data,
      photo: propertyImage.url,
      email: user.email,
  });
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
};