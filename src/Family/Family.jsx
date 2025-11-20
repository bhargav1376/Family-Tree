// Family.jsx
import React, { useEffect, useState } from "react";
import "./Family.css";

const LOCAL_STORAGE_KEY = "family-tree-data-v1";

function createEmptyPerson() {
  return {
    fullName: "",
    dob: "",
    imageUrl: "",
    instagram: "",
    linkedin: "",
    phone: "",
    whatsapp: "",
    root: {
      id: "root",
      fullName: "Family Root",
      dob: "1990-01-01",
      imageUrl:
        "https://via.placeholder.com/120.png?text=Root",a.placeholder.com/120.png?text=Root",a.placeholder.com/120.png?text=Root",
        ...prev,
        people: updatedPeople,
        rootId: id,
      };
    });
      </div>
      {children.length > 0 && (
        <div className="family-tree-children-block">
  rootId: "root",sName="family-tree-horizontal-line" />
          <div className="family-tree-children-wrapper">
            {children.map((child) => (
                key={child.id}
                person={child}
                people={people}
                onAddClick={onAddClick}
              />
            ))}
          </div>
        </div>
      )}
        newRootId = remainingIds[0] || null;n}
                target="_blank"
                rel="noreferrer"
function FamilyTreeNode({ person, people, onSelect, onAddClick }) {
                <i className="fa fa-linkedin" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
  return (
    <div className="family-tree-node">
      <div className="family-tree-node-card-wrapper">
        <div className="family-tree-node-connector" />
        <div
          className="family-tree-node-card"
          onClick={() => onSelect(person.id)}
        >
          <div className="family-tree-node-avatar">
            {person.imageUrl ? (
              <div className="family-tree-node-avatar-placeholder">
                {person.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>
          <div className="family-tree-node-info">
            <div className="family-tree-node-name">
              {person.fullName || "Unnamed"}
            </div>
              <div className="family-tree-node-dob">
                DOB: {person.dob}
              </div>
            )}
          </div>
          <button
            className="family-tree-node-add-btn"
            type="button"
            onClick={(e) => {
        newRootId = remainingIds[0] || null;and their descendants?")) return;
      // Collect this person and all descendants
      const toDelete = new Set();
      const stack = [personId];

      while (stack.length) {
        const id = stack.pop();
        if (!id || toDelete.has(id)) continue;
        toDelete.add(id);
        const p = updatedPeople[id];
        if (p && p.childrenIds) {
          p.childrenIds.forEach((cid) => stack.push(cid));
        }
      }

      // Remove references from parent
      if (person && person.parentId && updatedPeople[person.parentId]) {          childrenIds: parent.childrenIds.filter(
      toDelete.forEach((id) => {
        delete updatedPeople[id];
      });      if (toDelete.has(prev.rootId)) {
        // If root deleted, pick any remaining person as root        newRootId = remainingIds[0] || null;    if (!window.confirm("Delete this person and their descendants?")) return;
      // Collect this person and all descendants
      const toDelete = new Set();
      const stack = [personId];

      while (stack.length) {
        const id = stack.pop();
        if (!id || toDelete.has(id)) continue;
        toDelete.add(id);
        const p = updatedPeople[id];
        if (p && p.childrenIds) {
          p.childrenIds.forEach((cid) => stack.push(cid));
        }
      }

      // Remove references from parent
      if (person && person.parentId && updatedPeople[person.parentId]) {          childrenIds: parent.childrenIds.filter(
function FamilyTreeNode({ person, people, onSelect, onAddClick }) {
          ),      // Delete all
      toDelete.forEach((id) => {
        newRootId = remainingIds[0] || null;
      });      if (toDelete.has(prev.rootId)) {
        // If root deleted, pick any remaining person as root        newRootId = remainingIds[0] || null;    if (!window.confirm("Delete this person and their descendants?")) return;
      // Collect this person and all descendants
      const toDelete = new Set();
      const stack = [personId];

      while (stack.length) {
        const id = stack.pop();
        if (!id || toDelete.has(id)) continue;
        toDelete.add(id);
        const p = updatedPeople[id];
        if (p && p.childrenIds) {
          p.childrenIds.forEach((cid) => stack.push(cid));
        }
      }

      // Remove references from parent
      if (person && person.parentId && updatedPeople[person.parentId]) {          childrenIds: parent.childrenIds.filter(
            (cid) => cid !== personId
          ),      // Delete all
      toDelete.forEach((id) => {
        delete updatedPeople[id];
      });      if (toDelete.has(prev.rootId)) {
        // If root deleted, pick any remaining person as root        newRootId = remainingIds[0] || null;    if (!window.confirm("Delete this person?")) return;      if (!person) return prev;

      // Remove references from parent(s)
      if (person.parentId && updatedPeople[person.parentId]) {          childrenIds: parent.childrenIds.filter((cid) => cid !== personId),
        };
        // Also remove from spouse's parent if exists
        if (person.spouseId && updatedPeople[person.spouseId] && updatedPeople[person.spouseId].parentId) {
          const spouseParentId = updatedPeople[person.spouseId].parentId;
          if (updatedPeople[spouseParentId]) {
            updatedPeople[spouseParentId] = {
              ...updatedPeople[spouseParentId],
              childrenIds: updatedPeople[spouseParentId].childrenIds.filter(
                (cid) => cid !== person.spouseId
              ),
            };
          }
        }
      }
function FamilyTreeNode({ person, people, onSelect, onAddClick }) {
      // Remove spouse reference if exists
      if (person.spouseId && updatedPeople[person.spouseId]) {
        updatedPeople[person.spouseId] = {
    if (!window.confirm("Delete this person and their descendants?")) return;
    <div className="family-tree-node">
      <div className="family-tree-node-card-wrapper">
        <div className="family-tree-node-connector" />

      // Collect this person and all descendants
      const toDelete = new Set();
      const stack = [personId];

      while (stack.length) {
        const id = stack.pop();
        if (!id || toDelete.has(id)) continue;
        toDelete.add(id);
        const p = updatedPeople[id];
        if (p && p.childrenIds) {
          p.childrenIds.forEach((cid) => stack.push(cid));
        }
      }

      // Remove references from parent
        <div
      if (person && person.parentId && updatedPeople[person.parentId]) {
            {person.imageUrl ? (
              <img src={person.imageUrl} alt={person.fullName} />
            ) : (
          childrenIds: parent.childrenIds.filter(
            (cid) => cid !== personId
          ),do NOT trigger profile) */}
          <button
            className="family-tree-node-add-btn"
            type="button"
      // Delete all
      toDelete.forEach((id) => {
        delete updatedPeople[id];
      });se = false) => (
    <div className="family-tree-node-card-wrapper">
      <div className="family-tree-node-connector" />
      if (toDelete.has(prev.rootId)) {
        // If root deleted, pick any remaining person as root
        onClick={() => onSelect(p.id)}
    if (!window.confirm("Delete this person and their descendants?")) return;
            <img src={p.imageUrl} alt={p.fullName} />
          ) : (
            <div className="family-tree-node-avatar-placeholder">

      // Collect this person and all descendants
      const toDelete = new Set();
      const stack = [personId];

      while (stack.length) {
        const id = stack.pop();
        if (!id || toDelete.has(id)) continue;
        toDelete.add(id);
        const p = updatedPeople[id];
        if (p && p.childrenIds) {
          p.childrenIds.forEach((cid) => stack.push(cid));
        }
      }

      // Remove references from parent
              {p.fullName
      if (person && person.parentId && updatedPeople[person.parentId]) {
                .slice(0, 2)}
            </div>
          )}
          childrenIds: parent.childrenIds.filter(
            (cid) => cid !== personId
          ),a fa-plus-square" aria-hidden="true" />
        </button>
        {/* Remove button for children */}
        {p.parentId && (            className="family-tree-node-remove-btn"
      // Delete all
      toDelete.forEach((id) => {
        delete updatedPeople[id];
      });
              <img src={person.imageUrl} alt={person.fullName} />
            ) : (
      if (toDelete.has(prev.rootId)) {
        // If root deleted, pick any remaining person as root
                  .split(" ")
        newRootId = remainingIds[0] || null;
                  .slice(0, 2)}
              </div>
            )}
          </div>
          <div className="family-tree-node-info">
            <div className="family-tree-node-name">
              {person.fullName || "Unnamed"}
            </div>
            {person.dob && (
              <div className="family-tree-node-dob">
                DOB: {person.dob}
              </div>
            )}
          </div>
          {/* Plus icon (do NOT trigger profile) */}
          <button
            className="family-tree-node-add-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick(person.id, "child");
            }}
          >
            <i className="fa fa-plus-square" aria-hidden="true" />
          </button>
        </div>

        <div className="family-tree-node-actions-inline">            className="family-tree-link-btn"
              onAddClick(person.id, "parent");          >
            + Add previous generation
          </button>
        </div>