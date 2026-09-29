const inputAmount = document.querySelector('#amount');
const inputName = document.querySelector('#name');
const inputCategory = document.querySelector('#category');
const buttonSave = document.querySelector("#form_section-button");
const ul = document.querySelector('ul');
const score_total = document.querySelector(".score_total");
const filterButton = document.querySelector('.filter')


let list = JSON.parse(localStorage.getItem('expenses')) || [];
let i = list.length + 1 || 0;
let total = list.reduce((sum, item) => sum + item.amount, 0);

let currentFilter = 'Все';

function renderList() {
    ul.innerHTML = '';
    let counter = 1;
    
    const toShow = currentFilter === 'Все' 
        ? list 
        : list.filter(item => item.category === currentFilter)
    
    if (toShow.length === 0) {
        ul.innerHTML = list.length === 0
            ? `<li>Список пуст!</li>`
            : `<li>Нет трат в категории "${currentFilter}"</li>`
        score_total.textContent = 0
        return  // ← выходим, дальше не идём
    }

    toShow.forEach((item) => {
        let li = document.createElement('li');
        li.dataset.id = counter++;
        li.innerHTML = `<span data-id="${item.id}">#${li.dataset.id}</span><span data-id="${item.id}">${item.name}</span><span data-id="${item.id}">${item.amount}</span><span data-id="${item.id}">${item.category}</span><button class="delete" data-id="${item.id}">X</button>`;
        ul.append(li);
    })
    
    score_total.textContent = toShow.reduce((sum, item) => sum + item.amount, 0)
}
filterButton.addEventListener('click', function(e){
    if(!e.target.dataset.type){
        return
    }
    else currentFilter = e.target.dataset.type;
      filterButton.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active')
    })

    e.target.classList.add('active')
renderList();
})


const buttonRemoveAll = document.querySelector("#remove_all");


ul.addEventListener("click", function (e) {
    if (e.target.className === 'delete') {
        const id = Number(e.target.dataset.id)
        e.target.closest("li").remove();
        list = list.filter(item => item.id != id)
        localStorage.setItem('expenses', JSON.stringify(list))

        renderList();
    } else return


})



buttonRemoveAll.addEventListener('click', function () {
    list = [];
    localStorage.setItem('expenses', JSON.stringify(list));
    renderList();
})

renderList();
buttonSave.addEventListener('click', function () {
    if (inputAmount.value === '' || inputName.value === '') {
        alert('Введите все данные!')
        return
    }
    if (Number(inputAmount.value) <= 0) {
        alert('Сумма должна быть больше 0!')
        return
    }
    list.push({
        id: Number(i),
        name: inputName.value,
        amount: Number(inputAmount.value),
        category: inputCategory.value
    });
    localStorage.setItem('expenses', JSON.stringify(list))
    renderList();
    i++;
    total = total + Number(inputAmount.value);
    score_total.textContent = total;
    inputAmount.value = '';
    inputName.value = '';
})
