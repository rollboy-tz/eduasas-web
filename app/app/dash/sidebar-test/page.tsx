/**
 * ============================================================================
 * Sidebar V2 Test Page
 * ============================================================================
 *
 * Page rahisi ya ku-test:
 *
 * - Floating sidebar
 * - Expanded mode
 * - Minimal mode
 * - Profile popover
 *
 * @version 2.0.0
 */


"use client";


import {
  useSidebar,
} from "@/components/layout/SideBarV2/use-sidebar";



export default function SidebarTestPage() {


  const {
    size,
    setSize,
    isOpen,
    toggle,
  } = useSidebar();



  return (

    <div
      className="
        space-y-6
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-semibold
          "
        >
          Sidebar V2 Test
        </h1>


        <p
          className="
            text-muted-foreground
          "
        >
          Floating SaaS Sidebar playground
        </p>

      </div>



      <div
        className="
          flex
          gap-3
        "
      >

        <button
          onClick={() => setSize("expanded")}
          className="
            rounded-lg
            border
            px-4
            py-2
          "
        >
          Expanded
        </button>



        <button
          onClick={() => setSize("minimal")}
          className="
            rounded-lg
            border
            px-4
            py-2
          "
        >
          Minimal
        </button>



        <button
          onClick={toggle}
          className="
            rounded-lg
            border
            px-4
            py-2
          "
        >

          {
            isOpen
              ? "Close"
              : "Open"
          }

        </button>

      </div>



      <div
        className="
          rounded-2xl
          border
          p-6
        "
      >

        Current sidebar size:

        <strong>
          {" "}
          {size}
        </strong>

      </div>

    </div>

  );

}