window.formParameterValue = function(input) {
  const inputValue = input.closest('.form-group').querySelector(`[name=${input.name}Value]`);
  if (inputValue){
    //   console.log(inputValue)
    //   console.log(input.value)
      if (input.value == 'value' || (input.value == 'value' && input.checked)){
          console.log(input.checked)
          inputValue.disabled = false;
      } else {
          inputValue.disabled = true;
      }
  }
}