import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingBag,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import "./SimplePage.css";
import "./Wishlist.css";

export default function Wishlist() {
  const nav = useNavigate();

  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sbv-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const removeItem = (id) => {
    const updated = items.filter((item, index) => {
      if (item.id !== undefined) {
        return item.id !== id;
      }

      return index !== id;
    });

    setItems(updated);
    localStorage.setItem("sbv-wishlist", JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.setItem("sbv-wishlist", "[]");
  };

  useEffect(() => {
    const syncWishlist = () => {
      try {
        setItems(
          JSON.parse(localStorage.getItem("sbv-wishlist") || "[]")
        );
      } catch {
        setItems([]);
      }
    };

    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  return (
    <div className="wishlist-page">

      {/* ================= HERO ================= */}
      <section className="wishlist-hero">
        <div className="wishlist-hero-overlay">
          <div className="wishlist-hero-content">

            <span className="wishlist-eyebrow">
              YOUR PERSONAL COLLECTION
            </span>

            <h1>
              My <em>Wishlist</em>
            </h1>

            <p>
              Save the styles you love and keep your favourite
              fashion pieces close.
            </p>

            <div className="wishlist-breadcrumb">
              Home <b>›</b> Wishlist
            </div>

          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <main className="wishlist-main">

        <div className="wishlist-container">

          {items.length > 0 ? (
            <>
              {/* HEADER */}
              <div className="wishlist-heading">

                <div>
                  <span className="wishlist-small-title">
                    SAVED FOR LATER
                  </span>

                  <h2>
                    Your Favourite <em>Styles</em>
                  </h2>

                  <p>
                    {items.length}{" "}
                    {items.length === 1 ? "item" : "items"} saved
                    in your wishlist
                  </p>
                </div>

                <button
                  type="button"
                  className="wishlist-clear-btn"
                  onClick={clearWishlist}
                >
                  <FiTrash2 />
                  Clear Wishlist
                </button>

              </div>

              {/* PRODUCT GRID */}
              <div className="wishlist-product-grid">

                {items.map((product, index) => (
                  <div
                    className="wishlist-product-wrapper"
                    key={product.id || index}
                  >

                    {/* REMOVE */}
                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      title="Remove from wishlist"
                      onClick={() =>
                        removeItem(
                          product.id !== undefined
                            ? product.id
                            : index
                        )
                      }
                    >
                      <FiTrash2 />
                      <span>Remove</span>
                    </button>

                    <ProductCard product={product} />

                  </div>
                ))}

              </div>

              {/* BOTTOM CTA */}
              <section className="wishlist-bottom-cta">

                <div className="wishlist-cta-icon">
                  <FiHeart />
                </div>

                <div className="wishlist-cta-text">
                  <span>KEEP EXPLORING</span>

                  <h3>
                    Find More Styles You'll <em>Love</em>
                  </h3>

                  <p>
                    Discover new arrivals, trending styles and
                    exclusive fashion collections.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => nav("/shop")}
                  className="wishlist-shop-btn"
                >
                  Explore Collection
                  <FiArrowRight />
                </button>

              </section>
            </>
          ) : (

            /* ================= EMPTY STATE ================= */
            <section className="wishlist-empty">

              <div className="wishlist-empty-decoration decoration-one" />
              <div className="wishlist-empty-decoration decoration-two" />

              <div className="wishlist-empty-icon">
                <FiHeart />
              </div>

              <span className="wishlist-empty-label">
                YOUR COLLECTION
              </span>

              <h2>
                Your Wishlist is <em>Empty</em>
              </h2>

              <p>
                You haven't saved any favourites yet.
                <br />
                Explore our collections and add the styles
                you love.
              </p>

              <button
                type="button"
                className="wishlist-empty-btn"
                onClick={() => nav("/shop")}
              >
                <FiShoppingBag />
                Explore Shop
                <FiArrowRight />
              </button>

              <div className="wishlist-empty-note">
                <span />
                Save your favourite styles here
                <span />
              </div>

            </section>
          )}

        </div>

      </main>

    </div>
  );
}