import { Suspense } from "react"

import Component from "./diary-home"

export default function Page() {
  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}
