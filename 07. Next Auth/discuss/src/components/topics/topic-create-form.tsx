"use client";
import { useFormState } from "react-dom";
import { Input, Button, Textarea, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

import FormButton from "../common/form-button";
import * as actions from "@/actions";

function TopicCreateForm() {
  const [formState, action] = useFormState(actions.createTopic, { errors: {} }); // Remember it must match with the type that returns from the server action

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create a Topic</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              isInvalid={!!formState.errors.name}
              errorMessage={formState.errors.name?.join(", ")}
            />

            {/*
              // We wil not use this as we are using next ui
              formState.errors.name && <div>{formState.errors.name[0]}</div>
              */}
            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.join(", ")}
            />
            {/*
            // We wil not use this as we are using next ui
            formState.errors.description && <div>{formState.errors.description[0]}</div>
            */}

            {formState.errors._form && (
              <div className="p-2 bg-red-200 border border-red-400">{formState.errors._form?.join(", ")}</div>
            )}
            <FormButton>Save</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default TopicCreateForm;
