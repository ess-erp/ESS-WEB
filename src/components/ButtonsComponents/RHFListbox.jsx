import { Controller } from "react-hook-form";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

const RHFListbox = ({
    name,
    control,
    list,
    label,
    labelKey,
    isEditing,
    displayValue = "—",
    divClassName = "p-2",
}) => {

    return (
        <div className={divClassName}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>{label}</strong>
            </label>
            {isEditing ? (
                <input
                    type="text"
                    value={displayValue}
                    readOnly
                    className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            ) : (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Listbox value={field.value} onChange={field.onChange}>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full rounded-lg border py-2 pl-3 pr-10 text-left shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    {field.value ? field.value[labelKey] : "Select"}
                                    <ChevronUpDownIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg">
                                    {list.map(item => (
                                        <Listbox.Option
                                            key={item[labelKey]}
                                            value={item}
                                            className="cursor-pointer select-none py-2 pl-4 pr-4 hover:bg-blue-100"
                                        >
                                            {item[labelKey]}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    )}
                />
            )}

        </div>
    );
};

export default RHFListbox;
