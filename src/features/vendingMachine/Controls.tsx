import { useMemo, useRef } from "react";
import {
  insertMoney,
  selectProduct,
  selectInsertedMoney,
  selectProducts,
  selectSelectedProduct,
  setChange,
  selectChange,
  takeProduct,
} from "./vendingMachineSlice";
import cn from "classnames";
import {
  useAppDispatch,
  useAppSelector,
  useErrorTimeout,
} from "../../app/hooks";
import style from "./Controls.module.scss";

const acceptedBanknotes = ["50", "100", "200", "500"];
const acceptedCoins = [1, 2, 5, 10];

const Controls = () => {
  const dispatch = useAppDispatch();
  const insertedMoney = useAppSelector(selectInsertedMoney);
  const products = useAppSelector(selectProducts);
  const change = useAppSelector(selectChange);
  const selectedProduct = useAppSelector(selectSelectedProduct);

  const [banknoteError, setBanknoteError] = useErrorTimeout(false);

  const [notEnoughError, setNotEnoughError] = useErrorTimeout(false);
  const [incorrectChoose, setIncorrectChoose] = useErrorTimeout(false);

  const moneyFormRef = useRef<HTMLFormElement>(null);
  const moneyInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);

  const onMoneySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (moneyInputRef.current) {
      const banknote = moneyInputRef.current.value;

      if (!acceptedBanknotes.includes(banknote)) {
        setBanknoteError(true);
      } else {
        dispatch(insertMoney(Number(banknote)));

        e.currentTarget.reset();
      }
    }
  };

  const onProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (productInputRef.current) {
      const productNumberStr = productInputRef.current.value;
      const productNumbersArrStr = products.map((_, i) => String(i + 1));

      if (!productNumbersArrStr.includes(productNumberStr)) {
        setIncorrectChoose(true);
      } else {
        const selectedProduct = products[Number(productNumberStr) - 1];
        if (selectedProduct.price > insertedMoney) {
          setNotEnoughError(true);
        } else {
          dispatch(selectProduct(selectedProduct));

          let change = insertedMoney - selectedProduct.price;
          if (change) {
            const coinsMapArr = new Map<number, number>();
            for (let i = acceptedCoins.length - 1; change > 0; i--) {
              const needCoins = change / acceptedCoins[i];
              if (Math.floor(needCoins))
                coinsMapArr.set(acceptedCoins[i], Math.floor(needCoins));

              if (needCoins % 1 !== 0) {
                change = change % acceptedCoins[i];
                continue;
              } else {
                break;
              }
            }

            dispatch(setChange(Array.from(coinsMapArr)));
          }

          e.currentTarget.reset();
        }
      }
    }
  };

  const getMoneyLabelText = useMemo(() => {
    if (banknoteError) {
      return "Money is not accepted";
    }
    if (insertedMoney) {
      return `Inserted money: ${insertedMoney}₽`;
    }
    if (selectedProduct) {
      return "/";
    }

    return "Insert money";
  }, [banknoteError, insertedMoney, selectedProduct]);

  const getProductLabelText = useMemo(() => {
    if (incorrectChoose) {
      return "Enter correct product number";
    }
    if (notEnoughError) {
      return "Not enough money";
    }
    if (selectedProduct) {
      return "Success";
    }
    if (insertedMoney) {
      return "Choose product";
    }

    return "/";
  }, [incorrectChoose, notEnoughError, selectedProduct, insertedMoney]);

  return (
    <section className={style.controls}>
      <form onSubmit={onMoneySubmit} ref={moneyFormRef}>
        <label>{getMoneyLabelText}</label>
        {/* Decided to use uncontrolled inputs,
          because the benefits of controlled are practically not needed */}
        <input
          type="text"
          ref={moneyInputRef}
          placeholder="..."
          name="money"
          disabled={!!selectedProduct}
        />
        <p>
          Available banknotes: 50, 100, 200 or 500 ₽. The machine gives change
          in 1, 2, 5 and 10 ₽ coins.
        </p>
      </form>
      <form onSubmit={onProductSubmit}>
        <label>{getProductLabelText}</label>
        <input
          type="text"
          ref={productInputRef}
          placeholder="..."
          name="product"
          disabled={!insertedMoney || !!selectedProduct}
        />
      </form>
      <div className={style.output}>
        <div>
          {change.length > 0 &&
            change.map((elem) => {
              return (
                <span key={elem[0]}>
                  {elem[0]}₽: {elem[1]} coins
                </span>
              );
            })}
        </div>
        <div className={cn({ [style.cursorPointer]: selectedProduct })}>
          {selectedProduct && (
            <div
              className={style.selectedProduct}
              onClick={() => dispatch(takeProduct())}
            >
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.type}</p>
              <span>{selectedProduct.price}₽</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Controls;
