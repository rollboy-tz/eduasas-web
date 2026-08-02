import React, { useState } from "react";

import {
  SettingToggle,
  SettingSelect,
  SettingRadioGroup,
  SettingCheckbox,
  SettingSegmentedControl,
  SettingSlider,
  SettingInput,
} from "@/components/control";


export default function SettingsPlayground() {

  const [enabled, setEnabled] = useState(true);

  const [language, setLanguage] =
    useState("en");

  const [theme, setTheme] =
    useState("system");

  const [notifications, setNotifications] =
    useState(true);

  const [view, setView] =
    useState("grid");

  const [volume, setVolume] =
    useState(65);

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");


  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        dark:bg-black

        p-6
        md:p-10
      "
    >

      <div
        className="
          mx-auto
          max-w-3xl
          space-y-8
        "
      >


        {/* Header */}
        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Settings Components
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Modern reusable UI controls
          </p>
        </div>



        {/* Toggle */}
        <Section title="Toggle">

          <SettingToggle
            checked={enabled}
            onChange={setEnabled}
          />

        </Section>



        {/* Select */}
        <Section title="Select">

          <SettingSelect
            value={language}
            onChange={setLanguage}
            options={[
              {
                label:"English",
                value:"en",
              },
              {
                label:"Swahili",
                value:"sw",
              },
              {
                label:"French",
                value:"fr",
              },
            ]}
          />

        </Section>



        {/* Radio */}
        <Section title="Radio">

          <SettingRadioGroup
            value={theme}
            onChange={setTheme}
            options={[
              {
                label:"System",
                value:"system",
                description:
                  "Follow device theme",
              },

              {
                label:"Light",
                value:"light",
                description:
                  "Always light mode",
              },

              {
                label:"Dark",
                value:"dark",
                description:
                  "Always dark mode",
              },
            ]}
          />

        </Section>




        {/* Checkbox */}
        <Section title="Checkbox">

          <SettingCheckbox
            checked={notifications}
            onChange={setNotifications}
            label="Notifications"
            description="Receive app alerts"
          />

        </Section>




        {/* Segmented */}
        <Section title="Segmented Control">

          <SettingSegmentedControl
            value={view}
            onChange={setView}
            options={[
              {
                label:"Grid",
                value:"grid",
              },

              {
                label:"List",
                value:"list",
              },

              {
                label:"Compact",
                value:"compact",
              },
            ]}
          />

        </Section>




        {/* Slider */}
        <Section title="Slider">

          <SettingSlider
            value={volume}
            onChange={setVolume}
            showValue
          />

        </Section>




        {/* Inputs */}
        <Section title="Input">


          <div className="space-y-4">

            <SettingInput
              value={username}
              onChange={setUsername}
              label="Username"
              description="Your public name"
            />


            <SettingInput
              value={email}
              onChange={setEmail}
              label="Email"
              type="email"
            />


            <SettingInput
              value=""
              onChange={() => {}}
              label="Password"
              type="password"
            />

          </div>


        </Section>



      </div>

    </div>
  );
}





function Section({
  title,
  children,
}: {
  title:string;
  children:React.ReactNode;
}) {

  return (

    <section
      className="
        rounded-2xl

        border
        border-gray-200
        dark:border-gray-800

        bg-white
        dark:bg-gray-900

        p-5

        shadow-sm
      "
    >

      <h2
        className="
          mb-4

          text-sm
          font-bold

          text-gray-800
          dark:text-white
        "
      >
        {title}
      </h2>


      {children}

    </section>

  );
}