import React from 'react';
import { useGetIdentity, useActiveAuthProvider } from "@refinedev/core";
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FieldValues } from "react-hook-form";
import { useParams } from 'react-router-dom';
import RequirementForm from '../components/common/RequirementForm';

export const CreateRequirement = () => {
  const navigate = useNavigate();
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { id } = useParams();

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm({
    refineCoreProps: {
      action: "create",
      resource: "requirement",
      id: id,
    },
  });
  
  const onFinishHandler = async (data: FieldValues) => {
    
    await onFinish({
      ...data,
      email: user.email,
    });
    
    navigate('/'); // Navigate to home page after form submission
  };

  return (
    <RequirementForm type='Create'
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      onFinishHandler={onFinishHandler}
    />
  );
};
