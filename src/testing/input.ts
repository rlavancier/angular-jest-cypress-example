import { ComponentFixture } from '@angular/core/testing'

export async function setInputValue(fixture: ComponentFixture<any>, inputElement: HTMLInputElement, text: string): Promise<void> {
  await click(fixture, inputElement)
  inputElement.value = text
  inputElement.dispatchEvent(new Event('input'))

  fixture.detectChanges()
  await fixture.whenStable()
}

export async function click(fixture: ComponentFixture<any>, element: HTMLElement): Promise<void> {
  element.click()

  fixture.detectChanges()
  await fixture.whenStable()
}
