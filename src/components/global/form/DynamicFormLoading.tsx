import React from "react";
import Loading from "@/components/global/form/form-sections/Loading";

/*
Creating a separate component for loading because of an issue with react hook forms. 
The form data is fetch async, and if once the default data is set in the react hook form method inside dynamic form component, 
it is not updated once the default values data is updated. 
Hence we should not init the method until the data is final. 
Hence we are using a separate loading component to show the loading state. 
Can fix this later, but for now this is the temp solution.
*/
type DynamicFormLoadingProps = {};

const DynamicFormLoading: React.FC<DynamicFormLoadingProps> = () => {
  return (
    <div className="space-y-8">
      <section className="w-full flex flex-col gap-8">
        <Loading />
        <Loading />
      </section>
    </div>
  );
};
export default DynamicFormLoading;
