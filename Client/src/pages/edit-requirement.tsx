import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import RequirementForm from "../components/common/RequirementForm";
import { useActiveAuthProvider } from "@refinedev/core";
import { useParams } from "react-router-dom";

const EditRequirement = () => {
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
            action: "edit",
            resource: "requirement",
            id: id,
        },
      });


    const onFinishHandler = async (data: FieldValues) => {
        await onFinish({
            ...data,
            email: user.email,
        });
    };

    return (
        <RequirementForm
            type="Edit"
            register={register}
            onFinish={onFinish}
            formLoading={formLoading}
            handleSubmit={handleSubmit}
            onFinishHandler={onFinishHandler}
        />
    );
};

export default EditRequirement;