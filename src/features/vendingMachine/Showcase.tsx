import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import cn from "classnames";

import style from "./Showcase.module.scss";
import {
  getProducts,
  selectInsertedMoney,
  selectProducts,
} from "./vendingMachineSlice";

const Showcase = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const money = useAppSelector(selectInsertedMoney);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <section className={style.showcase}>
      <ul className={style.productList}>
        {products.map((product, i) => {
          const className = cn({
            [style.product]: true,
            [style.active]: money >= product.price,
          });

          return (
            <li className={className} key={product.name}>
              <h3>{product.name}</h3>
              <p className={style.type}>{product.type}</p>
              <div className={style.price}>
                <span>{product.price}₽</span>
                <span>{i + 1}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Showcase;
