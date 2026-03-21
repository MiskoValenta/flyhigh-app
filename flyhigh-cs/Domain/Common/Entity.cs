using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Common;

public abstract class Entity<TId> : IEquatable<Entity<TId>>
{
  public TId Id { get; protected set; }

  protected Entity(TId id)
  {
    Id = id;
  }

  protected Entity() { }

  public override bool Equals(object? obj)
  {
    return obj is Entity<TId> other && Equals(other);
  }

  public bool Equals(Entity<TId>? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return EqualityComparer<TId>.Default.Equals(Id, other.Id);
  }

  public override int GetHashCode()
  {
    return Id?.GetHashCode() ?? 0;
  }

  public static bool operator ==(Entity<TId>? a, Entity<TId>? b)
  {
    if (ReferenceEquals(a, b)) return true;
    if (a is null || b is null) return false;
    return a.Equals(b);
  }

  public static bool operator !=(Entity<TId>? a, Entity<TId>? b) => !(a == b);
}

public abstract class AuditableEntity<TId> : Entity<TId>
{
  public DateTime CreatedAt { get; private set; }
  public DateTime? ModifiedAt { get; private set; }

  public bool isDeleted { get; private set; } = false;
  public DateTime? DeletedAt { get; private set; }

  protected AuditableEntity(TId id) : base(id)
  {
    CreatedAt = DateTime.UtcNow;
  }

  protected AuditableEntity() { }

  protected void MarkAsModified()
  {
    ModifiedAt = DateTime.UtcNow;
  }

  public void MarkAsDeleted()
  {
    isDeleted = true;
    DeletedAt = DateTime.UtcNow;
    MarkAsModified();
  }
}