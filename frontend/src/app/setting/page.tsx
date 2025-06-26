"use client";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import Account from "../components/settings/Account";

const tabs = ["Account", "Notification", "Privacy", "Appearance"];

interface TabContent {
  title: string;
}

const CollapsibleTab = ({ title }: TabContent) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderContent = () => {
    switch (title.toLowerCase()) {
      case "account":
        return <Account />;

      default:
        return <h1>Coming soon!</h1>;
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4 py-2  rounded-lg border-b-[1px]">
        <h4 className="text-sm font-semibold">{title}</h4>
        <CollapsibleTrigger asChild>
          <button className="p-2">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2 px-1 w-scren">
        {renderContent()}
      </CollapsibleContent>
    </Collapsible>
  );
};

function page() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-300">
      <div className="flex flex-col items-start justify-start h-[800px] w-2/3 p-8">
        <h1 className="text-4xl mb-8">Settings</h1>

        <div className="w-full space-y-4">
          {tabs.map((tab) => (
            <CollapsibleTab key={tab} title={tab} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
