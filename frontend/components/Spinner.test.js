import Spinner from "./Spinner";
import { render, screen } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom/extend-expect';
// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.


test('render without errors', () => {
  render(<Spinner on/>);
})

test('Render null if prop is falsy', () => {
  const {container} = render (<Spinner on={false}/>);
  expect(container.firstChild).toBeNull();
});

test('Render spinner and message if truthy', () => {
  const {container} = render(<Spinner on={true}/>);
  expect(container).toBeTruthy();

  const spinnerElement = screen.getByTestId('spinner');
  expect(spinnerElement).toBeInTheDocument();
  expect(spinnerElement).toHaveTextContent('Please wait...');


  
})