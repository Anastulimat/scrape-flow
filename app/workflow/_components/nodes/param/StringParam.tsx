"use client";

import {useEffect, useId, useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {ParamProps} from "@/types/appNode";
import {Textarea} from "@/components/ui/textarea";


// ----------------------------------------------------------------------

const StringParam = ({param, value, updateNodeParamValue, disabled}: ParamProps) => {

    const id = useId();
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    let Component: any = Input;
    if (param.variant === "textarea") {
        Component = Textarea;
    }

    return (
        <div className="space-y-1 p-1 w-full">
            <Label htmlFor={id} className="text-xs flex">
                {param.name}
                {param.required && (
                    <p className="text-red-400 px-2">*</p>
                )}
            </Label>
            <Component
                className="text-xs"
                disabled={disabled}
                id={id}
                value={internalValue}
                placeholder="Enter value here"
                onChange={(e: any) => setInternalValue(e.target.value)}
                onBlur={(e: any) => updateNodeParamValue(e.target.value)}
            />
            {param.helperText && (
                <p className="text-muted-foreground px-2">
                    {param.helperText}
                </p>
            )}
        </div>
    );
};

export default StringParam;
